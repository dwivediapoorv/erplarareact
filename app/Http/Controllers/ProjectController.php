<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Project;
use App\Models\Services;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::with([
            'assignedTo:id,first_name,last_name',
            'projectManager:id,first_name,last_name'
        ])
            ->withCount([
                'tasks as open_tasks_count' => function ($query) {
                    $query->whereIn('status', ['Pending', 'Completed']);
                }
            ])
            ->orderBy('project_name', 'asc')
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'project_name' => $project->project_name,
                    'client_name' => $project->client_name,
                    'project_health' => $project->project_health,
                    'project_status' => $project->project_status,
                    'date_of_onboarding' => $project->date_of_onboarding,
                    'project_start_date' => $project->project_start_date,
                    'assigned_to_name' => $project->assignedTo ? $project->assignedTo->first_name . ' ' . $project->assignedTo->last_name : 'N/A',
                    'project_manager_name' => $project->projectManager ? $project->projectManager->first_name . ' ' . $project->projectManager->last_name : 'N/A',
                    'open_tasks_count' => $project->open_tasks_count ?? 0,
                ];
            });

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        // Get SEO team employees for "Assigned To" dropdown (only active users)
        $seoEmployees = Employee::with('team:id,name')
            ->whereHas('team', function ($query) {
                $query->where('name', 'Search Engine Optimization');
            })
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->select('id', 'team_id', 'first_name', 'last_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                ];
            });

        // Get Project Management team employees for "Project Manager" dropdown (only active users)
        $projectManagers = Employee::with('team:id,name')
            ->whereHas('team', function ($query) {
                $query->where('name', 'Project Management');
            })
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->select('id', 'team_id', 'first_name', 'last_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                ];
            });

        // Get all services
        $services = Services::select('id', 'name')->get();

        return Inertia::render('projects/create', [
            'seoEmployees' => $seoEmployees,
            'projectManagers' => $projectManagers,
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_name' => ['required', 'string', 'max:255'],
            'onboarding_notes' => ['nullable', 'string'],
            'date_of_onboarding' => ['nullable', 'date'],
            'project_start_date' => ['nullable', 'date'],
            'client_name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'email_address' => ['required', 'email', 'max:255'],
            'alternate_email_address' => ['nullable', 'email', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'alternate_phone_number' => ['nullable', 'string', 'max:20'],
            'assigned_to' => ['nullable', 'exists:employees,id'],
            'project_manager_id' => ['nullable', 'exists:employees,id'],
            'blogs_count' => ['nullable', 'integer', 'min:0'],
            'monthly_report_date' => ['nullable', 'date'],
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['exists:services,id'],
        ]);

        DB::beginTransaction();

        try {
            // Create the project (project_health and project_status will use database defaults: Green and Active)
            $project = Project::create([
                'project_name' => $validated['project_name'],
                'onboarding_notes' => $validated['onboarding_notes'] ?? null,
                'date_of_onboarding' => $validated['date_of_onboarding'] ?? null,
                'project_start_date' => $validated['project_start_date'] ?? null,
                'client_name' => $validated['client_name'],
                'website' => $validated['website'] ?? null,
                'email_address' => $validated['email_address'],
                'alternate_email_address' => $validated['alternate_email_address'] ?? null,
                'phone_number' => $validated['phone_number'],
                'alternate_phone_number' => $validated['alternate_phone_number'] ?? null,
                'assigned_to' => $validated['assigned_to'] ?? null,
                'project_manager_id' => $validated['project_manager_id'] ?? null,
                'blogs_count' => $validated['blogs_count'] ?? null,
                'monthly_report_date' => $validated['monthly_report_date'] ?? null,
            ]);

            // Attach services to the project
            $project->services()->attach($validated['service_ids']);

            DB::commit();

            return to_route('projects.index')->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Project creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create project: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'services:id,name',
            'assignedTo:id,first_name,last_name',
            'projectManager:id,first_name,last_name'
        ]);

        return Inertia::render('projects/show', [
            'project' => [
                'id' => $project->id,
                'project_name' => $project->project_name,
                'onboarding_notes' => $project->onboarding_notes,
                'date_of_onboarding' => $project->date_of_onboarding,
                'project_start_date' => $project->project_start_date,
                'client_name' => $project->client_name,
                'website' => $project->website,
                'email_address' => $project->email_address,
                'alternate_email_address' => $project->alternate_email_address,
                'phone_number' => $project->phone_number,
                'alternate_phone_number' => $project->alternate_phone_number,
                'assigned_to_name' => $project->assignedTo ? $project->assignedTo->first_name . ' ' . $project->assignedTo->last_name : 'N/A',
                'project_manager_name' => $project->projectManager ? $project->projectManager->first_name . ' ' . $project->projectManager->last_name : 'N/A',
                'project_health' => $project->project_health,
                'project_status' => $project->project_status,
                'blogs_count' => $project->blogs_count,
                'monthly_report_date' => $project->monthly_report_date,
                'services' => $project->services,
                'created_at' => $project->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $project->updated_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project): Response
    {
        $project->load('services:id');

        // Get SEO team employees for "Assigned To" dropdown (only active users)
        $seoEmployees = Employee::with('team:id,name')
            ->whereHas('team', function ($query) {
                $query->where('name', 'Search Engine Optimization');
            })
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->select('id', 'team_id', 'first_name', 'last_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                ];
            });

        // Get Project Management team employees for "Project Manager" dropdown (only active users)
        $projectManagers = Employee::with('team:id,name')
            ->whereHas('team', function ($query) {
                $query->where('name', 'Project Management');
            })
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->select('id', 'team_id', 'first_name', 'last_name')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                ];
            });

        $services = Services::select('id', 'name')->get();

        return Inertia::render('projects/edit', [
            'project' => [
                'id' => $project->id,
                'project_name' => $project->project_name,
                'onboarding_notes' => $project->onboarding_notes,
                'date_of_onboarding' => $project->date_of_onboarding,
                'project_start_date' => $project->project_start_date,
                'client_name' => $project->client_name,
                'website' => $project->website,
                'email_address' => $project->email_address,
                'alternate_email_address' => $project->alternate_email_address,
                'phone_number' => $project->phone_number,
                'alternate_phone_number' => $project->alternate_phone_number,
                'assigned_to' => $project->assigned_to,
                'project_manager_id' => $project->project_manager_id,
                'project_health' => $project->project_health,
                'project_status' => $project->project_status,
                'blogs_count' => $project->blogs_count,
                'monthly_report_date' => $project->monthly_report_date,
                'service_ids' => $project->services->pluck('id')->toArray(),
            ],
            'seoEmployees' => $seoEmployees,
            'projectManagers' => $projectManagers,
            'services' => $services,
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'project_name' => ['required', 'string', 'max:255'],
            'onboarding_notes' => ['nullable', 'string'],
            'date_of_onboarding' => ['nullable', 'date'],
            'project_start_date' => ['nullable', 'date'],
            'client_name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'email_address' => ['required', 'email', 'max:255'],
            'alternate_email_address' => ['nullable', 'email', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'alternate_phone_number' => ['nullable', 'string', 'max:20'],
            'assigned_to' => ['nullable', 'exists:employees,id'],
            'project_manager_id' => ['nullable', 'exists:employees,id'],
            'project_health' => ['required', 'in:Red,Green,Orange'],
            'project_status' => ['required', 'in:Active,On Hold,Suspended'],
            'blogs_count' => ['nullable', 'integer', 'min:0'],
            'monthly_report_date' => ['nullable', 'date'],
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['exists:services,id'],
        ]);

        DB::beginTransaction();

        try {
            // Update the project
            $project->update([
                'project_name' => $validated['project_name'],
                'onboarding_notes' => $validated['onboarding_notes'] ?? null,
                'date_of_onboarding' => $validated['date_of_onboarding'] ?? null,
                'project_start_date' => $validated['project_start_date'] ?? null,
                'client_name' => $validated['client_name'],
                'website' => $validated['website'] ?? null,
                'email_address' => $validated['email_address'],
                'alternate_email_address' => $validated['alternate_email_address'] ?? null,
                'phone_number' => $validated['phone_number'],
                'alternate_phone_number' => $validated['alternate_phone_number'] ?? null,
                'assigned_to' => $validated['assigned_to'] ?? null,
                'project_manager_id' => $validated['project_manager_id'] ?? null,
                'project_health' => $validated['project_health'],
                'project_status' => $validated['project_status'],
                'blogs_count' => $validated['blogs_count'] ?? null,
                'monthly_report_date' => $validated['monthly_report_date'] ?? null,
            ]);

            // Sync services (this will remove old and add new)
            $project->services()->sync($validated['service_ids']);

            DB::commit();

            return to_route('projects.index')->with('success', 'Project updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Project update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update project: ' . $e->getMessage()])->withInput();
        }
    }
}
