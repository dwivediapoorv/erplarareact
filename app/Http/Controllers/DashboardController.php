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

        // Get total active users
        $activeUsersCount = User::where('is_active', true)->count();

        // Get total projects
        $totalProjects = Project::count();

        // Get total open tasks (Pending + Completed, excluding Approved)
        $openTasksCount = Task::whereIn('status', ['Pending', 'Completed'])->count();

        // Get project counts by health status
        $greenProjectsCount = Project::where('project_health', 'Green')->count();
        $orangeProjectsCount = Project::where('project_health', 'Orange')->count();
        $redProjectsCount = Project::where('project_health', 'Red')->count();

        // Get users with their open task counts
        $usersWithOpenTasks = User::where('is_active', true)
            ->withCount(['assignedTasks as open_tasks_count' => function ($query) {
                $query->whereIn('status', ['Pending', 'Completed']);
            }])
            ->get()
            ->filter(function ($user) {
                return $user->open_tasks_count > 0;
            })
            ->sortByDesc('open_tasks_count')
            ->values()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'open_tasks_count' => $user->open_tasks_count,
                ];
            });

        return Inertia::render('dashboard', [
            'activeUsersCount' => $activeUsersCount,
            'totalProjects' => $totalProjects,
            'openTasksCount' => $openTasksCount,
            'greenProjectsCount' => $greenProjectsCount,
            'orangeProjectsCount' => $orangeProjectsCount,
            'redProjectsCount' => $redProjectsCount,
            'usersWithOpenTasks' => $usersWithOpenTasks,
        ]);
    }
}
