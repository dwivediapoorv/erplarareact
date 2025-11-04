<?php

namespace App\Http\Controllers;

use App\Models\MOM;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MOMController extends Controller
{
    /**
     * Display a listing of minutes of meetings.
     */
    public function index(): Response
    {
        $moms = MOM::with('project:id,project_name')
            ->select('id', 'project_id', 'title', 'description', 'meeting_date')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($mom) {
                return [
                    'id' => $mom->id,
                    'project_id' => $mom->project_id,
                    'project_name' => $mom->project?->project_name ?? 'N/A',
                    'title' => $mom->title,
                    'description' => $mom->description,
                    'meeting_date' => $mom->meeting_date?->format('Y-m-d'),
                ];
            });

        return Inertia::render('minutes-of-meetings/index', [
            'moms' => $moms,
        ]);
    }

    /**
     * Show the form for creating a new minutes of meeting.
     */
    public function create(): Response
    {
        // Get all projects for the dropdown
        $projects = Project::select('id', 'project_name')
            ->orderBy('project_name', 'asc')
            ->get();

        return Inertia::render('minutes-of-meetings/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created minutes of meeting in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Convert empty string to null for meeting_date
        $request->merge([
            'meeting_date' => $request->meeting_date ?: null,
        ]);

        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'meeting_date' => ['nullable', 'date'],
        ]);

        MOM::create($validated);

        return to_route('minutes-of-meetings.index')->with('success', 'Minutes of Meeting created successfully.');
    }
}
