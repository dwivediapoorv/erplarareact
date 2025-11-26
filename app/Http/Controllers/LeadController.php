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
            ->select('id', 'website', 'email', 'phone', 'timezone', 'lead_date', 'status', 'priority', 'uploaded_by', 'current_owner_id', 'last_contacted_at', 'next_follow_up_at', 'created_at');

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
                $q->where('website', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
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
            'website' => ['nullable', 'url', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'notes' => ['nullable', 'string'],
            'auto_assign' => ['nullable', 'boolean'],
        ]);

        $validated['uploaded_by'] = $request->user()->id;
        $validated['status'] = 'new';
        $validated['lead_date'] = now()->toDateString();

        // Set default source if not provided or empty
        if (!isset($validated['source']) || $validated['source'] === '' || $validated['source'] === null) {
            $validated['source'] = 'scrubbing_team';
        }

        // Handle auto-assignment with round-robin
        $autoAssign = $request->boolean('auto_assign', false);

        if ($autoAssign) {
            // Get calling team members for round-robin assignment
            $callingTeamMembers = User::whereHas('roles', function ($query) {
                $query->where('name', 'Calling Team');
            })
                ->where('is_active', true)
                ->get();

            if ($callingTeamMembers->isNotEmpty()) {
                // Use random assignment for single lead (round-robin makes more sense for bulk)
                // But we'll use consistent logic by getting the next available member
                // For simplicity, we'll assign to the member with the least current leads
                $assignee = $callingTeamMembers->sortBy(function ($member) {
                    return $member->ownedLeads()->count();
                })->first();

                $validated['current_owner_id'] = $assignee->id;
                $validated['status'] = 'assigned';
            }
        }

        $lead = Lead::create($validated);

        // Create assignment record if auto-assigned
        if ($autoAssign && isset($validated['current_owner_id'])) {
            LeadAssignment::create([
                'lead_id' => $lead->id,
                'assigned_to' => $validated['current_owner_id'],
                'assigned_by' => $request->user()->id,
                'assigned_at' => now(),
            ]);
        }

        $message = 'Lead created successfully.';
        if ($autoAssign && isset($validated['current_owner_id'])) {
            $assigneeName = User::find($validated['current_owner_id'])->name;
            $message .= " Automatically assigned to {$assigneeName}.";
        }

        return to_route('leads.index')->with('success', $message);
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
            'website' => ['nullable', 'url', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'timezone' => ['nullable', 'string', 'max:255'],
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
            'auto_assign' => ['nullable', 'boolean'],
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
            $autoAssign = $request->boolean('auto_assign', false);

            // Get calling team members for round-robin assignment if enabled
            $callingTeamMembers = [];
            $currentAssigneeIndex = 0;

            if ($autoAssign) {
                $callingTeamMembers = User::whereHas('roles', function ($query) {
                    $query->where('name', 'Calling Team');
                })
                    ->where('is_active', true)
                    ->get();

                if ($callingTeamMembers->isEmpty()) {
                    return back()->withErrors(['file' => 'No active calling team members available for assignment.']);
                }
            }

            DB::beginTransaction();

            foreach ($rows as $row) {
                // Skip only completely empty rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Map columns: Website, Phone, Email, Timezone
                $leadData = [
                    'website' => $row[0] ?? null,
                    'phone' => $row[1] ?? null,
                    'email' => $row[2] ?? null,
                    'timezone' => $row[3] ?? null,
                    'lead_date' => now()->toDateString(),
                    'uploaded_by' => $request->user()->id,
                    'status' => 'new',
                    'source' => 'scrubbing_team',
                ];

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

                // Round-robin assignment if enabled
                if ($autoAssign && !empty($callingTeamMembers)) {
                    $assignee = $callingTeamMembers[$currentAssigneeIndex];
                    $leadData['current_owner_id'] = $assignee->id;
                    $leadData['status'] = 'assigned';

                    // Move to next assignee (round-robin)
                    $currentAssigneeIndex = ($currentAssigneeIndex + 1) % $callingTeamMembers->count();
                }

                $lead = Lead::create($leadData);

                // Create lead assignment record if auto-assigned
                if ($autoAssign && isset($leadData['current_owner_id'])) {
                    \App\Models\LeadAssignment::create([
                        'lead_id' => $lead->id,
                        'assigned_to' => $leadData['current_owner_id'],
                        'assigned_by' => $request->user()->id,
                        'assigned_at' => now(),
                    ]);
                }

                $imported++;
            }

            DB::commit();

            $message = "Successfully imported {$imported} leads. Skipped {$skipped} duplicates/invalid rows.";
            if ($autoAssign) {
                $message .= " Leads automatically assigned to " . $callingTeamMembers->count() . " calling team members.";
            }

            return to_route('leads.index')->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Lead upload failed: ' . $e->getMessage());
            return back()->withErrors(['file' => 'Failed to import leads: ' . $e->getMessage()]);
        }
    }

    /**
     * Download sample Excel file for lead upload.
     */
    public function downloadSample()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $sheet->setCellValue('A1', 'Website');
        $sheet->setCellValue('B1', 'Phone');
        $sheet->setCellValue('C1', 'Email');
        $sheet->setCellValue('D1', 'Timezone');

        // Style headers (bold)
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);

        // Add sample data
        $sheet->setCellValue('A2', 'https://example.com');
        $sheet->setCellValue('B2', '+1234567890');
        $sheet->setCellValue('C2', 'john@example.com');
        $sheet->setCellValue('D2', 'America/New_York');

        $sheet->setCellValue('A3', 'https://sample-website.com');
        $sheet->setCellValue('B3', '+9876543210');
        $sheet->setCellValue('C3', 'jane@sample.com');
        $sheet->setCellValue('D3', 'Europe/London');

        // Auto-size columns
        foreach (range('A', 'D') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Create Excel file
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $filename = 'leads_upload_sample_' . date('Y-m-d') . '.xlsx';

        // Send file to browser
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit;
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
