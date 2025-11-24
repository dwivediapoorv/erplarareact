<?php

namespace App\Http\Controllers;

use App\Models\CallLog;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CallLogController extends Controller
{
    /**
     * Display a listing of call logs.
     */
    public function index(Request $request): Response
    {
        $query = CallLog::with(['lead:id,name,company_name,phone', 'caller:id,name'])
            ->select('id', 'lead_id', 'called_by', 'call_status', 'call_disposition', 'called_at', 'duration_minutes', 'next_follow_up_at');

        // Filter by calling team (see only their calls)
        if ($request->user()->hasRole('Calling Team')) {
            $query->where('called_by', $request->user()->id);
        }

        // Filter by call status
        if ($request->has('call_status') && $request->call_status != '') {
            $query->where('call_status', $request->call_status);
        }

        // Filter by disposition
        if ($request->has('call_disposition') && $request->call_disposition != '') {
            $query->where('call_disposition', $request->call_disposition);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from != '') {
            $query->whereDate('called_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to != '') {
            $query->whereDate('called_at', '<=', $request->date_to);
        }

        $callLogs = $query->orderBy('called_at', 'desc')->paginate(20);

        return Inertia::render('calls/index', [
            'callLogs' => $callLogs,
            'filters' => $request->only(['call_status', 'call_disposition', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new call log.
     */
    public function create(Request $request): Response
    {
        $leadId = $request->query('lead_id');
        $lead = null;

        if ($leadId) {
            $lead = Lead::select('id', 'name', 'company_name', 'phone', 'email', 'status')
                ->findOrFail($leadId);
        }

        return Inertia::render('calls/create', [
            'lead' => $lead,
        ]);
    }

    /**
     * Store a newly created call log.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lead_id' => ['required', 'exists:leads,id'],
            'call_status' => ['required', 'in:connected,not_connected,busy,no_answer,wrong_number,switched_off,not_reachable'],
            'call_disposition' => ['nullable', 'in:interested,not_interested,call_back_later,hot_lead,meeting_scheduled,wrong_person,language_barrier,already_using_service,budget_constraints,not_decision_maker'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'call_notes' => ['nullable', 'string'],
            'pitch_response' => ['nullable', 'string'],
            'pain_points' => ['nullable', 'string'],
            'next_follow_up_at' => ['nullable', 'date', 'after:now'],
            'recording_url' => ['nullable', 'url'],
        ]);

        DB::beginTransaction();

        try {
            // Create call log
            $validated['called_by'] = $request->user()->id;
            $validated['called_at'] = now();

            $callLog = CallLog::create($validated);

            // Update lead based on call disposition
            $lead = Lead::find($validated['lead_id']);

            $leadUpdates = [
                'last_contacted_at' => now(),
            ];

            // Update lead status based on call disposition
            if ($validated['call_status'] === 'connected') {
                if ($lead->status === 'assigned' || $lead->status === 'new') {
                    $leadUpdates['status'] = 'in_progress';
                }

                // Check for specific dispositions
                if (isset($validated['call_disposition'])) {
                    switch ($validated['call_disposition']) {
                        case 'hot_lead':
                            $leadUpdates['status'] = 'hot_lead';
                            break;
                        case 'meeting_scheduled':
                            $leadUpdates['status'] = 'meeting_scheduled';
                            break;
                        case 'not_interested':
                        case 'already_using_service':
                            $leadUpdates['status'] = 'lost';
                            $leadUpdates['lost_reason'] = $validated['call_disposition'];
                            break;
                        case 'wrong_person':
                        case 'language_barrier':
                            $leadUpdates['status'] = 'unqualified';
                            break;
                    }
                }

                // If connected and lead was new/assigned, mark as connected
                if ($lead->status === 'new' || $lead->status === 'assigned') {
                    $leadUpdates['status'] = 'connected';
                }
            }

            // Set next follow-up date
            if (isset($validated['next_follow_up_at'])) {
                $leadUpdates['next_follow_up_at'] = $validated['next_follow_up_at'];
            }

            $lead->update($leadUpdates);

            DB::commit();

            return to_route('leads.show', $lead)->with('success', 'Call logged successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Call log creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to log call: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified call log.
     */
    public function show(CallLog $callLog): Response
    {
        $callLog->load([
            'lead:id,name,company_name,phone,email',
            'caller:id,name',
        ]);

        return Inertia::render('calls/show', [
            'callLog' => $callLog,
        ]);
    }

    /**
     * Show the form for editing the call log.
     */
    public function edit(CallLog $callLog): Response
    {
        $callLog->load('lead:id,name,company_name,phone');

        return Inertia::render('calls/edit', [
            'callLog' => $callLog,
        ]);
    }

    /**
     * Update the specified call log.
     */
    public function update(Request $request, CallLog $callLog): RedirectResponse
    {
        $validated = $request->validate([
            'call_status' => ['required', 'in:connected,not_connected,busy,no_answer,wrong_number,switched_off,not_reachable'],
            'call_disposition' => ['nullable', 'in:interested,not_interested,call_back_later,hot_lead,meeting_scheduled,wrong_person,language_barrier,already_using_service,budget_constraints,not_decision_maker'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'call_notes' => ['nullable', 'string'],
            'pitch_response' => ['nullable', 'string'],
            'pain_points' => ['nullable', 'string'],
            'next_follow_up_at' => ['nullable', 'date', 'after:now'],
            'recording_url' => ['nullable', 'url'],
        ]);

        DB::beginTransaction();

        try {
            $callLog->update($validated);

            // Update lead's next follow-up date if changed
            if (isset($validated['next_follow_up_at'])) {
                $callLog->lead->update([
                    'next_follow_up_at' => $validated['next_follow_up_at'],
                ]);
            }

            DB::commit();

            return to_route('leads.show', $callLog->lead)->with('success', 'Call log updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Call log update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update call log: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified call log.
     */
    public function destroy(CallLog $callLog): RedirectResponse
    {
        $lead = $callLog->lead;
        $callLog->delete();

        return to_route('leads.show', $lead)->with('success', 'Call log deleted successfully.');
    }

    /**
     * Quick log call from lead show page.
     */
    public function quickLog(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'call_status' => ['required', 'in:connected,not_connected,busy,no_answer,wrong_number,switched_off,not_reachable'],
            'call_disposition' => ['nullable', 'in:interested,not_interested,call_back_later,hot_lead,meeting_scheduled,wrong_person,language_barrier,already_using_service,budget_constraints,not_decision_maker'],
            'call_notes' => ['nullable', 'string'],
            'next_follow_up_at' => ['nullable', 'date', 'after:now'],
        ]);

        DB::beginTransaction();

        try {
            // Create call log
            CallLog::create([
                'lead_id' => $lead->id,
                'called_by' => $request->user()->id,
                'called_at' => now(),
                'call_status' => $validated['call_status'],
                'call_disposition' => $validated['call_disposition'] ?? null,
                'call_notes' => $validated['call_notes'] ?? null,
                'next_follow_up_at' => $validated['next_follow_up_at'] ?? null,
            ]);

            // Update lead
            $leadUpdates = [
                'last_contacted_at' => now(),
            ];

            if ($validated['call_status'] === 'connected') {
                if ($lead->status === 'assigned' || $lead->status === 'new') {
                    $leadUpdates['status'] = 'connected';
                }

                if (isset($validated['call_disposition'])) {
                    switch ($validated['call_disposition']) {
                        case 'hot_lead':
                            $leadUpdates['status'] = 'hot_lead';
                            break;
                        case 'meeting_scheduled':
                            $leadUpdates['status'] = 'meeting_scheduled';
                            break;
                    }
                }
            }

            if (isset($validated['next_follow_up_at'])) {
                $leadUpdates['next_follow_up_at'] = $validated['next_follow_up_at'];
            }

            $lead->update($leadUpdates);

            DB::commit();

            return back()->with('success', 'Call logged successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Quick call log failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to log call: ' . $e->getMessage()]);
        }
    }
}
