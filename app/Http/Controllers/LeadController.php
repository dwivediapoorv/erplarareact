<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadAssignment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class LeadController extends Controller
{
    /**
     * Display a listing of leads.
     */
    public function index(Request $request): Response
    {
        $query = Lead::with(['uploadedBy:id,name', 'currentOwner:id,name'])
            ->select('id', 'name', 'email', 'phone', 'website', 'company_name', 'status', 'priority', 'uploaded_by', 'current_owner_id', 'last_contacted_at', 'next_follow_up_at', 'created_at');

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by owner (for calling team to see their leads)
        if ($request->user()->hasRole('Calling Team')) {
            $query->where('current_owner_id', $request->user()->id);
        }

        // Filter by priority
        if ($request->has('priority') && $request->priority != '') {
            $query->where('priority', $request->priority);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(20);

        // Add labels for relationships
        $leads->getCollection()->transform(function ($lead) {
            $lead->uploaded_by_label = $lead->uploadedBy?->name;
            $lead->current_owner_label = $lead->currentOwner?->name;
            return $lead;
        });

        return Inertia::render('leads/index', [
            'leads' => $leads,
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new lead.
     */
    public function create(): Response
    {
        return Inertia::render('leads/create');
    }

    /**
     * Store a newly created lead.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['uploaded_by'] = $request->user()->id;
        $validated['status'] = 'new';

        Lead::create($validated);

        return to_route('leads.index')->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified lead.
     */
    public function show(Lead $lead): Response
    {
        $lead->load([
            'uploadedBy:id,name',
            'currentOwner:id,name',
            'callLogs' => function ($query) {
                $query->with('caller:id,name')->latest()->limit(10);
            },
            'meetings' => function ($query) {
                $query->with(['scheduledBy:id,name', 'assignedTo:id,name'])->latest();
            },
            'notes' => function ($query) {
                $query->with('createdBy:id,name')->latest();
            },
            'assignments' => function ($query) {
                $query->with(['assignedTo:id,name', 'assignedBy:id,name'])->latest();
            },
        ]);

        return Inertia::render('leads/show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Show the form for editing the lead.
     */
    public function edit(Lead $lead): Response
    {
        return Inertia::render('leads/edit', [
            'lead' => $lead,
        ]);
    }

    /**
     * Update the specified lead.
     */
    public function update(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:new,assigned,in_progress,connected,hot_lead,meeting_scheduled,meeting_completed,converted,lost,unqualified'],
            'lost_reason' => ['nullable', 'string', 'max:255'],
        ]);

        $lead->update($validated);

        return to_route('leads.show', $lead)->with('success', 'Lead updated successfully.');
    }

    /**
     * Remove the specified lead.
     */
    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return to_route('leads.index')->with('success', 'Lead deleted successfully.');
    }

    /**
     * Show the upload page for bulk lead import.
     */
    public function uploadForm(): Response
    {
        return Inertia::render('leads/upload');
    }

    /**
     * Handle Excel file upload and import leads.
     */
    public function upload(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'], // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $spreadsheet = IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            // Skip header row
            $header = array_shift($rows);

            $imported = 0;
            $skipped = 0;

            DB::beginTransaction();

            foreach ($rows as $row) {
                // Skip empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Map columns: Name, Email, Phone, Website
                // Adjust indices based on your Excel structure
                $leadData = [
                    'name' => $row[0] ?? null,
                    'email' => $row[1] ?? null,
                    'phone' => $row[2] ?? null,
                    'website' => $row[3] ?? null,
                    'company_name' => $row[4] ?? null,
                    'designation' => $row[5] ?? null,
                    'city' => $row[6] ?? null,
                    'state' => $row[7] ?? null,
                    'country' => $row[8] ?? null,
                    'uploaded_by' => $request->user()->id,
                    'status' => 'new',
                    'source' => 'scrubbing_team',
                ];

                // Skip if name is empty
                if (empty($leadData['name'])) {
                    $skipped++;
                    continue;
                }

                // Check for duplicates (by email or phone)
                $exists = Lead::where(function ($query) use ($leadData) {
                    if (!empty($leadData['email'])) {
                        $query->where('email', $leadData['email']);
                    }
                    if (!empty($leadData['phone'])) {
                        $query->orWhere('phone', $leadData['phone']);
                    }
                })->exists();

                if ($exists) {
                    $skipped++;
                    continue;
                }

                Lead::create($leadData);
                $imported++;
            }

            DB::commit();

            return to_route('leads.index')->with('success', "Successfully imported {$imported} leads. Skipped {$skipped} duplicates/invalid rows.");
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Lead upload failed: ' . $e->getMessage());
            return back()->withErrors(['file' => 'Failed to import leads: ' . $e->getMessage()]);
        }
    }

    /**
     * Show assignment page for WFM.
     */
    public function assignForm(Lead $lead): Response
    {
        // Get users with Calling Team role
        $callers = User::role('Calling Team')
            ->where('is_active', true)
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('leads/assign', [
            'lead' => $lead->load('currentOwner:id,name'),
            'callers' => $callers,
        ]);
    }

    /**
     * Assign lead to a caller (WFM action).
     */
    public function assign(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'assigned_to' => ['required', 'exists:users,id'],
            'assignment_notes' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();

        try {
            // Deactivate previous assignments
            LeadAssignment::where('lead_id', $lead->id)
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'unassigned_at' => now(),
                ]);

            // Create new assignment
            LeadAssignment::create([
                'lead_id' => $lead->id,
                'assigned_to' => $validated['assigned_to'],
                'assigned_by' => $request->user()->id,
                'assigned_at' => now(),
                'assignment_notes' => $validated['assignment_notes'] ?? null,
                'is_active' => true,
            ]);

            // Update lead
            $lead->update([
                'current_owner_id' => $validated['assigned_to'],
                'status' => 'assigned',
            ]);

            DB::commit();

            return to_route('leads.index')->with('success', 'Lead assigned successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Lead assignment failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to assign lead: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk assign leads to callers.
     */
    public function bulkAssign(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lead_ids' => ['required', 'array'],
            'lead_ids.*' => ['exists:leads,id'],
            'assigned_to' => ['required', 'exists:users,id'],
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated['lead_ids'] as $leadId) {
                $lead = Lead::find($leadId);

                // Deactivate previous assignments
                LeadAssignment::where('lead_id', $lead->id)
                    ->where('is_active', true)
                    ->update([
                        'is_active' => false,
                        'unassigned_at' => now(),
                    ]);

                // Create new assignment
                LeadAssignment::create([
                    'lead_id' => $lead->id,
                    'assigned_to' => $validated['assigned_to'],
                    'assigned_by' => $request->user()->id,
                    'assigned_at' => now(),
                    'is_active' => true,
                ]);

                // Update lead
                $lead->update([
                    'current_owner_id' => $validated['assigned_to'],
                    'status' => 'assigned',
                ]);
            }

            DB::commit();

            $count = count($validated['lead_ids']);
            return to_route('leads.index')->with('success', "{$count} leads assigned successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Bulk lead assignment failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to assign leads: ' . $e->getMessage()]);
        }
    }
}
