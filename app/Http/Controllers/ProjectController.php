<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Project;
use App\Models\Services;
use App\Models\UserPreference;
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
    public function index(Request $request): Response
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
                    'date_of_onboarding' => $project->date_of_onboarding?->format('Y-m-d'),
                    'project_start_date' => $project->project_start_date?->format('Y-m-d'),
                    'monthly_report_date' => $project->monthly_report_date,
                    'assigned_to_name' => $project->assignedTo ? $project->assignedTo->first_name . ' ' . $project->assignedTo->last_name : 'N/A',
                    'assigned_to_id' => $project->assignedTo?->id,
                    'project_manager_name' => $project->projectManager ? $project->projectManager->first_name . ' ' . $project->projectManager->last_name : 'N/A',
                    'project_manager_id' => $project->projectManager?->id,
                    'open_tasks_count' => $project->open_tasks_count ?? 0,
                ];
            });

        // Get user's column visibility preferences
        $columnPreferences = UserPreference::where('user_id', $request->user()->id)
            ->where('page', 'projects.index')
            ->where('preference_key', 'column_visibility')
            ->first();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'columnPreferences' => $columnPreferences?->preference_value ?? null,
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
        // Convert empty strings to null for date fields before validation
        $request->merge([
            'date_of_onboarding' => $request->date_of_onboarding ?: null,
            'project_start_date' => $request->project_start_date ?: null,
            'monthly_report_date' => $request->monthly_report_date ?: null,
        ]);

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

        // Get latest tasks for this project
        $tasks = $project->tasks()
            ->with(['assignee:id,name'])
            ->select('id', 'name', 'status', 'due_date', 'assigned_to', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'name' => $task->name,
                    'status' => $task->status,
                    'due_date' => $task->due_date?->format('d M Y'),
                    'assignee_name' => $task->assignee?->name ?? 'N/A',
                    'created_at' => $task->created_at->format('d M Y'),
                ];
            });

        // Get latest MOMs for this project
        $moms = $project->moms()
            ->select('id', 'title', 'meeting_date', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($mom) {
                return [
                    'id' => $mom->id,
                    'title' => $mom->title,
                    'meeting_date' => $mom->meeting_date?->format('d M Y'),
                    'created_at' => $mom->created_at->format('d M Y'),
                ];
            });

        // Get latest interactions for this project
        $interactions = $project->interactions()
            ->select('id', 'interaction_type', 'interaction_date', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($interaction) {
                return [
                    'id' => $interaction->id,
                    'interaction_type' => $interaction->interaction_type,
                    'interaction_date' => $interaction->interaction_date?->format('d M Y'),
                    'created_at' => $interaction->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('projects/show', [
            'project' => [
                'id' => $project->id,
                'project_name' => $project->project_name,
                'onboarding_notes' => $project->onboarding_notes,
                'date_of_onboarding' => $project->date_of_onboarding?->format('Y-m-d'),
                'project_start_date' => $project->project_start_date?->format('Y-m-d'),
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
                'monthly_report_date' => $project->monthly_report_date?->format('Y-m-d'),
                'services' => $project->services,
                'created_at' => $project->created_at?->format('Y-m-d'),
                'updated_at' => $project->updated_at?->format('Y-m-d'),
            ],
            'tasks' => $tasks,
            'moms' => $moms,
            'interactions' => $interactions,
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
                'date_of_onboarding' => $project->date_of_onboarding?->format('Y-m-d'),
                'project_start_date' => $project->project_start_date?->format('Y-m-d'),
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
                'monthly_report_date' => $project->monthly_report_date?->format('Y-m-d'),
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
        // Convert empty strings to null for date fields before validation
        $request->merge([
            'date_of_onboarding' => $request->date_of_onboarding ?: null,
            'project_start_date' => $request->project_start_date ?: null,
            'monthly_report_date' => $request->monthly_report_date ?: null,
        ]);

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

    /**
     * Display projects assigned to a specific employee.
     */
    public function byAssignedTo(Request $request, Employee $employee): Response
    {
        $projects = Project::with([
            'assignedTo:id,first_name,last_name',
            'projectManager:id,first_name,last_name'
        ])
            ->where('assigned_to', $employee->id)
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
                    'date_of_onboarding' => $project->date_of_onboarding?->format('Y-m-d'),
                    'project_start_date' => $project->project_start_date?->format('Y-m-d'),
                    'monthly_report_date' => $project->monthly_report_date,
                    'assigned_to_name' => $project->assignedTo ? $project->assignedTo->first_name . ' ' . $project->assignedTo->last_name : 'N/A',
                    'assigned_to_id' => $project->assignedTo?->id,
                    'project_manager_name' => $project->projectManager ? $project->projectManager->first_name . ' ' . $project->projectManager->last_name : 'N/A',
                    'project_manager_id' => $project->projectManager?->id,
                    'open_tasks_count' => $project->open_tasks_count ?? 0,
                ];
            });

        // Get user's column visibility preferences
        $columnPreferences = UserPreference::where('user_id', $request->user()->id)
            ->where('page', 'projects.index')
            ->where('preference_key', 'column_visibility')
            ->first();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'columnPreferences' => $columnPreferences?->preference_value ?? null,
            'filterType' => 'assigned_to',
            'filterName' => $employee->first_name . ' ' . $employee->last_name,
        ]);
    }

    /**
     * Display projects managed by a specific project manager.
     */
    public function byProjectManager(Request $request, Employee $employee): Response
    {
        $projects = Project::with([
            'assignedTo:id,first_name,last_name',
            'projectManager:id,first_name,last_name'
        ])
            ->where('project_manager_id', $employee->id)
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
                    'date_of_onboarding' => $project->date_of_onboarding?->format('Y-m-d'),
                    'project_start_date' => $project->project_start_date?->format('Y-m-d'),
                    'monthly_report_date' => $project->monthly_report_date,
                    'assigned_to_name' => $project->assignedTo ? $project->assignedTo->first_name . ' ' . $project->assignedTo->last_name : 'N/A',
                    'assigned_to_id' => $project->assignedTo?->id,
                    'project_manager_name' => $project->projectManager ? $project->projectManager->first_name . ' ' . $project->projectManager->last_name : 'N/A',
                    'project_manager_id' => $project->projectManager?->id,
                    'open_tasks_count' => $project->open_tasks_count ?? 0,
                ];
            });

        // Get user's column visibility preferences
        $columnPreferences = UserPreference::where('user_id', $request->user()->id)
            ->where('page', 'projects.index')
            ->where('preference_key', 'column_visibility')
            ->first();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'columnPreferences' => $columnPreferences?->preference_value ?? null,
            'filterType' => 'project_manager',
            'filterName' => $employee->first_name . ' ' . $employee->last_name,
        ]);
    }

    /**
     * Display a list of employees with their assigned project counts.
     * Only counts active projects.
     */
    public function assignedProjects(): Response
    {
        // Get all employees with their active assigned project counts
        $employeesWithProjects = Employee::whereHas('assignedProjects', function ($query) {
                $query->where('project_status', 'Active');
            })
            ->withCount(['assignedProjects as assigned_projects_count' => function ($query) {
                $query->where('project_status', 'Active');
            }])
            ->with('user:id,name')
            ->orderBy('first_name', 'asc')
            ->orderBy('last_name', 'asc')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'user_name' => $employee->user?->name,
                    'assigned_projects_count' => $employee->assigned_projects_count,
                ];
            });

        return Inertia::render('projects/assigned', [
            'employees' => $employeesWithProjects,
        ]);
    }
}
