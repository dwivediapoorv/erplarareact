<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        // Check if current user is inactive
        if (!auth()->user()->is_active) {
            return Inertia::render('inactive');
        }

        $user = auth()->user();
        $roles = $user->roles->pluck('name')->toArray();

        // Determine which dashboard to show based on role priority
        if (in_array('Admin', $roles) || in_array('Manager', $roles)) {
            return $this->adminDashboard();
        } else {
            return $this->employeeDashboard();
        }
    }

    /**
     * Admin/Manager Dashboard - Overview of entire system
     */
    private function adminDashboard(): Response
    {
        // Get total projects
        $totalProjects = Project::count();

        // Get total open tasks (Pending + Completed, excluding Approved)
        $openTasksCount = Task::whereIn('status', ['Pending', 'Completed'])->count();

        // Get project counts by health status
        $greenProjectsCount = Project::where('project_health', 'Green')->count();
        $orangeProjectsCount = Project::where('project_health', 'Orange')->count();
        $redProjectsCount = Project::where('project_health', 'Red')->count();

        // Get users with open tasks — whereHas filters in DB, withCount adds the count
        $usersWithOpenTasks = User::where('is_active', true)
            ->whereHas('assignedTasks', function ($query) {
                $query->whereIn('status', ['Pending', 'Completed']);
            })
            ->withCount(['assignedTasks as open_tasks_count' => function ($query) {
                $query->whereIn('status', ['Pending', 'Completed']);
            }])
            ->orderByDesc('open_tasks_count')
            ->get(['id', 'name'])
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'open_tasks_count' => $user->open_tasks_count,
            ]);

        // Get projects with open tasks — whereHas filters in DB, withCount adds the count
        $projectsWithOpenTasks = Project::whereHas('tasks', function ($query) {
                $query->whereIn('status', ['Pending', 'Completed']);
            })
            ->withCount(['tasks as open_tasks_count' => function ($query) {
                $query->whereIn('status', ['Pending', 'Completed']);
            }])
            ->orderByDesc('open_tasks_count')
            ->get(['id', 'project_name', 'project_health'])
            ->map(fn ($project) => [
                'id' => $project->id,
                'name' => $project->project_name,
                'open_tasks_count' => $project->open_tasks_count,
                'health' => $project->project_health,
            ]);

        return Inertia::render('dashboard', [
            'dashboardType' => 'admin',
            'totalProjects' => $totalProjects,
            'openTasksCount' => $openTasksCount,
            'greenProjectsCount' => $greenProjectsCount,
            'orangeProjectsCount' => $orangeProjectsCount,
            'redProjectsCount' => $redProjectsCount,
            'usersWithOpenTasks' => $usersWithOpenTasks,
            'projectsWithOpenTasks' => $projectsWithOpenTasks,
        ]);
    }

    /**
     * Employee Dashboard - Personal tasks and projects
     */
    private function employeeDashboard(): Response
    {
        $userId = auth()->id();
        $user = auth()->user()->load('employee');

        $myOpenTasks = Task::where('assigned_to', $userId)
            ->whereIn('status', ['Pending', 'Completed'])
            ->count();

        // Count projects assigned to the user's employee record
        $myProjects = 0;
        if ($user->employee) {
            $myProjects = Project::where('assigned_to', $user->employee->id)
                ->orWhere('project_manager_id', $user->employee->id)
                ->count();
        }

        // Get my tasks with project info
        $myTasks = Task::where('assigned_to', $userId)
            ->whereIn('status', ['Pending', 'Completed'])
            ->with('project:id,project_name,project_health')
            ->orderBy('due_date')
            ->limit(10)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->name,
                    'status' => $task->status,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'project_name' => $task->project?->project_name,
                    'project_health' => $task->project?->project_health,
                ];
            });

        return Inertia::render('dashboard', [
            'dashboardType' => 'employee',
            'myOpenTasks' => $myOpenTasks,
            'myProjects' => $myProjects,
            'myTasks' => $myTasks,
        ]);
    }
}
