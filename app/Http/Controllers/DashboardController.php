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
        // Get total active users
        $activeUsersCount = User::whereRaw('is_active = true')->count();

        // Get total projects
        $totalProjects = Project::count();

        // Get total open tasks (Pending + Completed, excluding Approved)
        $openTasksCount = Task::whereIn('status', ['Pending', 'Completed'])->count();

        // Get project counts by health status
        $greenProjectsCount = Project::where('project_health', 'Green')->count();
        $orangeProjectsCount = Project::where('project_health', 'Orange')->count();
        $redProjectsCount = Project::where('project_health', 'Red')->count();

        return Inertia::render('dashboard', [
            'activeUsersCount' => $activeUsersCount,
            'totalProjects' => $totalProjects,
            'openTasksCount' => $openTasksCount,
            'greenProjectsCount' => $greenProjectsCount,
            'orangeProjectsCount' => $orangeProjectsCount,
            'redProjectsCount' => $redProjectsCount,
        ]);
    }
}
