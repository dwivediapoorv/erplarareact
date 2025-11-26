<?php

namespace App\Http\Controllers;

use App\Models\CallLog;
use App\Models\Lead;
use App\Models\Meeting;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
        } elseif (in_array('Scrubbing Team', $roles)) {
            return $this->scrubbingTeamDashboard();
        } elseif (in_array('WFM', $roles)) {
            return $this->wfmDashboard();
        } elseif (in_array('Calling Team', $roles)) {
            return $this->callingTeamDashboard();
        } else {
            return $this->employeeDashboard();
        }
    }

    /**
     * Admin/Manager Dashboard - Overview of entire system
     */
    private function adminDashboard(): Response
    {
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

        // CRM Stats
        $totalLeads = Lead::count();
        $newLeads = Lead::where('status', 'new')->count();
        $hotLeads = Lead::where('status', 'hot_lead')->count();
        $convertedLeads = Lead::where('status', 'converted')->count();

        return Inertia::render('dashboard', [
            'dashboardType' => 'admin',
            'activeUsersCount' => $activeUsersCount,
            'totalProjects' => $totalProjects,
            'openTasksCount' => $openTasksCount,
            'greenProjectsCount' => $greenProjectsCount,
            'orangeProjectsCount' => $orangeProjectsCount,
            'redProjectsCount' => $redProjectsCount,
            'usersWithOpenTasks' => $usersWithOpenTasks,
            'totalLeads' => $totalLeads,
            'newLeads' => $newLeads,
            'hotLeads' => $hotLeads,
            'convertedLeads' => $convertedLeads,
        ]);
    }

    /**
     * Scrubbing Team Dashboard - Lead upload and management
     */
    private function scrubbingTeamDashboard(): Response
    {
        $userId = auth()->id();

        $totalUploaded = Lead::where('uploaded_by', $userId)->count();
        $unassignedLeads = Lead::where('uploaded_by', $userId)
            ->where('status', 'new')
            ->whereNull('current_owner_id')
            ->count();
        $assignedLeads = Lead::where('uploaded_by', $userId)
            ->whereNotNull('current_owner_id')
            ->count();
        $convertedLeads = Lead::where('uploaded_by', $userId)
            ->where('status', 'converted')
            ->count();

        // Recent uploads
        $recentUploads = Lead::where('uploaded_by', $userId)
            ->with('currentOwner:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'website' => $lead->website,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'status' => $lead->status,
                    'assigned_to' => $lead->currentOwner?->name,
                    'created_at' => $lead->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('dashboard', [
            'dashboardType' => 'scrubbing',
            'totalUploaded' => $totalUploaded,
            'unassignedLeads' => $unassignedLeads,
            'assignedLeads' => $assignedLeads,
            'convertedLeads' => $convertedLeads,
            'recentUploads' => $recentUploads,
        ]);
    }

    /**
     * WFM Dashboard - Lead assignment and team performance
     */
    private function wfmDashboard(): Response
    {
        $totalLeads = Lead::count();
        $unassignedLeads = Lead::whereNull('current_owner_id')->count();
        $assignedLeads = Lead::whereNotNull('current_owner_id')->count();
        $hotLeads = Lead::where('status', 'hot_lead')->count();

        // Team performance - calls made today
        $todayCalls = CallLog::whereDate('called_at', today())->count();
        $todayMeetings = Meeting::whereDate('scheduled_at', today())->count();

        // Calling team members with lead counts
        $callingTeamMembers = User::whereHas('roles', function ($query) {
            $query->where('name', 'Calling Team');
        })
            ->withCount(['ownedLeads as assigned_leads_count'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'assigned_leads_count' => $user->assigned_leads_count,
                ];
            });

        return Inertia::render('dashboard', [
            'dashboardType' => 'wfm',
            'totalLeads' => $totalLeads,
            'unassignedLeads' => $unassignedLeads,
            'assignedLeads' => $assignedLeads,
            'hotLeads' => $hotLeads,
            'todayCalls' => $todayCalls,
            'todayMeetings' => $todayMeetings,
            'callingTeamMembers' => $callingTeamMembers,
        ]);
    }

    /**
     * Calling Team Dashboard - Assigned leads and call activities
     */
    private function callingTeamDashboard(): Response
    {
        $userId = auth()->id();

        $assignedLeads = Lead::where('current_owner_id', $userId)->count();
        $newLeads = Lead::where('current_owner_id', $userId)
            ->where('status', 'assigned')
            ->count();
        $hotLeads = Lead::where('current_owner_id', $userId)
            ->where('status', 'hot_lead')
            ->count();
        $meetingsScheduled = Meeting::where('assigned_to', $userId)
            ->where('status', 'scheduled')
            ->count();

        // Today's activities
        $todayCalls = CallLog::where('called_by', $userId)
            ->whereDate('called_at', today())
            ->count();
        $todayConnected = CallLog::where('called_by', $userId)
            ->whereDate('called_at', today())
            ->where('call_status', 'connected')
            ->count();

        // Upcoming meetings
        $upcomingMeetings = Meeting::where('assigned_to', $userId)
            ->where('status', 'scheduled')
            ->where('scheduled_at', '>=', now())
            ->with('lead:id,website,email,phone')
            ->orderBy('scheduled_at')
            ->limit(5)
            ->get()
            ->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'lead_website' => $meeting->lead->website,
                    'lead_email' => $meeting->lead->email,
                    'lead_phone' => $meeting->lead->phone,
                    'scheduled_at' => $meeting->scheduled_at->format('Y-m-d H:i'),
                ];
            });

        // Follow-ups needed
        $followUpsNeeded = Lead::where('current_owner_id', $userId)
            ->whereNotNull('next_follow_up_at')
            ->where('next_follow_up_at', '<=', now()->addDays(2))
            ->orderBy('next_follow_up_at')
            ->limit(10)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'website' => $lead->website,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'next_follow_up_at' => $lead->next_follow_up_at?->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('dashboard', [
            'dashboardType' => 'calling',
            'assignedLeads' => $assignedLeads,
            'newLeads' => $newLeads,
            'hotLeads' => $hotLeads,
            'meetingsScheduled' => $meetingsScheduled,
            'todayCalls' => $todayCalls,
            'todayConnected' => $todayConnected,
            'upcomingMeetings' => $upcomingMeetings,
            'followUpsNeeded' => $followUpsNeeded,
        ]);
    }

    /**
     * Employee Dashboard - Personal tasks and projects
     */
    private function employeeDashboard(): Response
    {
        $userId = auth()->id();

        $myOpenTasks = Task::where('assigned_to', $userId)
            ->whereIn('status', ['Pending', 'Completed'])
            ->count();

        $myProjects = DB::table('project_user')
            ->where('user_id', $userId)
            ->count();

        // Get my tasks with project info
        $myTasks = Task::where('assigned_to', $userId)
            ->whereIn('status', ['Pending', 'Completed'])
            ->with('project:id,name,project_health')
            ->orderBy('due_date')
            ->limit(10)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'due_date' => $task->due_date?->format('Y-m-d'),
                    'project_name' => $task->project->name,
                    'project_health' => $task->project->project_health,
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
