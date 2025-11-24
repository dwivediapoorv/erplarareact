<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Meeting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    /**
     * Display a listing of meetings.
     */
    public function index(Request $request): Response
    {
        $query = Meeting::with(['lead:id,name,company_name,phone', 'scheduledBy:id,name', 'assignedTo:id,name'])
            ->select('id', 'lead_id', 'scheduled_by', 'assigned_to', 'title', 'scheduled_at', 'duration_minutes', 'meeting_type', 'status', 'reschedule_count');

        // Filter by assigned user (calling team sees their meetings)
        if ($request->user()->hasRole('Calling Team')) {
            $query->where('assigned_to', $request->user()->id);
        }

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by meeting type
        if ($request->has('meeting_type') && $request->meeting_type != '') {
            $query->where('meeting_type', $request->meeting_type);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from != '') {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to != '') {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        $meetings = $query->orderBy('scheduled_at', 'asc')->paginate(20);

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['status', 'meeting_type', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new meeting.
     */
    public function create(Request $request): Response
    {
        $leadId = $request->query('lead_id');
        $lead = null;

        if ($leadId) {
            $lead = Lead::select('id', 'name', 'company_name', 'phone', 'email', 'current_owner_id')
                ->with('currentOwner:id,name')
                ->findOrFail($leadId);
        }

        // Get users for assignment (Manager/Admin can see all, Calling Team sees themselves)
        $users = User::role(['Calling Team', 'Manager', 'Admin'])
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('meetings/create', [
            'lead' => $lead,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created meeting.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lead_id' => ['required', 'exists:leads,id'],
            'assigned_to' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'meeting_type' => ['required', 'in:physical,online,phone'],
            'meeting_link' => ['nullable', 'url', 'required_if:meeting_type,online'],
            'location' => ['nullable', 'string', 'required_if:meeting_type,physical'],
        ]);

        DB::beginTransaction();

        try {
            // Create meeting
            $validated['scheduled_by'] = $request->user()->id;
            $validated['status'] = 'scheduled';
            $validated['reschedule_count'] = 0;

            $meeting = Meeting::create($validated);

            // Update lead status
            $lead = Lead::find($validated['lead_id']);
            $lead->update([
                'status' => 'meeting_scheduled',
                'next_follow_up_at' => $validated['scheduled_at'],
            ]);

            DB::commit();

            return to_route('leads.show', $lead)->with('success', 'Meeting scheduled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Meeting creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to schedule meeting: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified meeting.
     */
    public function show(Meeting $meeting): Response
    {
        $meeting->load([
            'lead:id,name,company_name,phone,email',
            'scheduledBy:id,name',
            'assignedTo:id,name',
            'rescheduledFrom:id,scheduled_at,reschedule_count',
        ]);

        return Inertia::render('meetings/show', [
            'meeting' => $meeting,
        ]);
    }

    /**
     * Show the form for editing the meeting.
     */
    public function edit(Meeting $meeting): Response
    {
        $meeting->load('lead:id,name,company_name');

        $users = User::role(['Calling Team', 'Manager', 'Admin'])
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('meetings/edit', [
            'meeting' => $meeting,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified meeting.
     */
    public function update(Request $request, Meeting $meeting): RedirectResponse
    {
        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'meeting_type' => ['required', 'in:physical,online,phone'],
            'meeting_link' => ['nullable', 'url', 'required_if:meeting_type,online'],
            'location' => ['nullable', 'string', 'required_if:meeting_type,physical'],
            'status' => ['nullable', 'in:scheduled,rescheduled,completed,no_show,cancelled'],
            'outcome' => ['nullable', 'in:converted,follow_up_needed,not_interested,proposal_sent,thinking', 'required_if:status,completed'],
            'meeting_notes' => ['nullable', 'string'],
            'action_items' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            // If meeting is being marked as completed
            if (isset($validated['status']) && $validated['status'] === 'completed') {
                $validated['completed_at'] = now();

                // Update lead status based on outcome
                if (isset($validated['outcome'])) {
                    $leadStatus = match ($validated['outcome']) {
                        'converted' => 'converted',
                        'not_interested' => 'lost',
                        default => 'meeting_completed',
                    };

                    $meeting->lead->update([
                        'status' => $leadStatus,
                        'last_contacted_at' => now(),
                    ]);

                    if ($leadStatus === 'lost') {
                        $meeting->lead->update([
                            'lost_reason' => 'not_interested_after_meeting',
                        ]);
                    }
                }
            }

            $meeting->update($validated);

            DB::commit();

            return to_route('leads.show', $meeting->lead)->with('success', 'Meeting updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Meeting update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update meeting: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified meeting.
     */
    public function destroy(Meeting $meeting): RedirectResponse
    {
        $lead = $meeting->lead;
        $meeting->delete();

        return to_route('leads.show', $lead)->with('success', 'Meeting deleted successfully.');
    }

    /**
     * Show the form for rescheduling a meeting.
     */
    public function rescheduleForm(Meeting $meeting): Response
    {
        $meeting->load([
            'lead:id,name,company_name,phone',
            'assignedTo:id,name',
        ]);

        $users = User::role(['Calling Team', 'Manager', 'Admin'])
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('meetings/reschedule', [
            'meeting' => $meeting,
            'users' => $users,
        ]);
    }

    /**
     * Reschedule a meeting.
     */
    public function reschedule(Request $request, Meeting $meeting): RedirectResponse
    {
        $validated = $request->validate([
            'scheduled_at' => ['required', 'date', 'after:now'],
            'reschedule_reason' => ['required', 'string', 'max:500'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        DB::beginTransaction();

        try {
            // Mark old meeting as rescheduled
            $meeting->update([
                'status' => 'rescheduled',
            ]);

            // Create new meeting
            $newMeeting = Meeting::create([
                'lead_id' => $meeting->lead_id,
                'scheduled_by' => $request->user()->id,
                'assigned_to' => $validated['assigned_to'] ?? $meeting->assigned_to,
                'title' => $meeting->title,
                'description' => ($meeting->description ?? '') . "\n\nRescheduled from: " . $meeting->scheduled_at->format('Y-m-d H:i') . "\nReason: " . $validated['reschedule_reason'],
                'scheduled_at' => $validated['scheduled_at'],
                'duration_minutes' => $meeting->duration_minutes,
                'meeting_type' => $meeting->meeting_type,
                'meeting_link' => $meeting->meeting_link,
                'location' => $meeting->location,
                'status' => 'rescheduled',
                'reschedule_count' => $meeting->reschedule_count + 1,
                'rescheduled_from' => $meeting->id,
            ]);

            // Update lead
            $meeting->lead->update([
                'status' => 'meeting_scheduled',
                'next_follow_up_at' => $validated['scheduled_at'],
            ]);

            DB::commit();

            return to_route('leads.show', $meeting->lead)->with('success', 'Meeting rescheduled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Meeting reschedule failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to reschedule meeting: ' . $e->getMessage()]);
        }
    }

    /**
     * Quick schedule meeting from lead show page.
     */
    public function quickSchedule(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'duration_minutes' => ['required', 'integer', 'min:15', 'max:480'],
            'meeting_type' => ['required', 'in:physical,online,phone'],
            'meeting_link' => ['nullable', 'url'],
            'location' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            Meeting::create([
                'lead_id' => $lead->id,
                'scheduled_by' => $request->user()->id,
                'assigned_to' => $lead->current_owner_id ?? $request->user()->id,
                'title' => $validated['title'],
                'scheduled_at' => $validated['scheduled_at'],
                'duration_minutes' => $validated['duration_minutes'],
                'meeting_type' => $validated['meeting_type'],
                'meeting_link' => $validated['meeting_link'] ?? null,
                'location' => $validated['location'] ?? null,
                'status' => 'scheduled',
                'reschedule_count' => 0,
            ]);

            $lead->update([
                'status' => 'meeting_scheduled',
                'next_follow_up_at' => $validated['scheduled_at'],
            ]);

            DB::commit();

            return back()->with('success', 'Meeting scheduled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Quick meeting schedule failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to schedule meeting: ' . $e->getMessage()]);
        }
    }
}
