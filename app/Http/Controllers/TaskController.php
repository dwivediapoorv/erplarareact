<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index(): Response
    {
        $tasks = Task::with([
            'creator:id,name',
            'assignee:id,name',
            'project:id,project_name',
            'approver:id,name'
        ])
            ->select('id', 'name', 'description', 'created_by', 'assigned_to', 'project_id', 'status', 'completed_at', 'approved_by', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'name' => $task->name,
                    'description' => $task->description,
                    'creator_name' => $task->creator->name,
                    'assignee_name' => $task->assignee->name,
                    'project_name' => $task->project->project_name,
                    'status' => $task->status,
                    'completed_at' => $task->completed_at?->format('Y-m-d'),
                    'approver_name' => $task->approver?->name,
                    'created_at' => $task->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new task.
     */
    public function create(): Response
    {
        // Get all active users for assignment
        $users = User::where('is_active', true)
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        // Get all projects
        $projects = Project::select('id', 'project_name')
            ->orderBy('project_name', 'asc')
            ->get();

        return Inertia::render('tasks/create', [
            'users' => $users,
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'assigned_to' => ['required', 'exists:users,id'],
            'project_id' => ['required', 'exists:projects,id'],
        ]);

        Task::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => auth()->id(),
            'assigned_to' => $validated['assigned_to'],
            'project_id' => $validated['project_id'],
            'status' => 'Pending',
        ]);

        return to_route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Mark task as completed by the assignee.
     */
    public function complete(Task $task): RedirectResponse
    {
        // Only the assigned user can mark as completed
        if ($task->assigned_to !== auth()->id()) {
            return back()->withErrors(['error' => 'You are not authorized to complete this task.']);
        }

        if ($task->status !== 'Pending') {
            return back()->withErrors(['error' => 'Task is already completed or approved.']);
        }

        $task->update([
            'status' => 'Completed',
            'completed_at' => now(),
        ]);

        return back()->with('success', 'Task marked as completed. Waiting for approval.');
    }

    /**
     * Approve/close task by the creator.
     */
    public function approve(Task $task): RedirectResponse
    {
        // Only the task creator can approve
        if ($task->created_by !== auth()->id()) {
            return back()->withErrors(['error' => 'You are not authorized to approve this task.']);
        }

        if ($task->status !== 'Completed') {
            return back()->withErrors(['error' => 'Task must be completed before approval.']);
        }

        $task->update([
            'status' => 'Approved',
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Task approved and closed successfully.');
    }
}
