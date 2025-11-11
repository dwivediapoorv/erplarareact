<?php

namespace App\Http\Controllers;

use App\Models\ContentFlow;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContentFlowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $contentFlows = ContentFlow::with(['project:id,project_name', 'creator:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($flow) {
                return [
                    'id' => $flow->id,
                    'title' => $flow->title,
                    'project_name' => $flow->project->project_name,
                    'primary_keyword' => $flow->primary_keyword,
                    'approval_status' => $flow->approval_status,
                    'published_on' => $flow->published_on?->format('Y-m-d'),
                    'ai_score' => $flow->ai_score,
                    'creator_name' => $flow->creator->name,
                    'created_at' => $flow->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('content-flows/index', [
            'contentFlows' => $contentFlows,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $user = auth()->user();
        $employee = $user->employee;

        // Get projects assigned to the user's employee
        $projects = Project::when($employee, function ($query) use ($employee) {
            $query->where('assigned_to', $employee->id);
        })
            ->select('id', 'project_name')
            ->orderBy('project_name')
            ->get();

        return Inertia::render('content-flows/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'primary_keyword' => 'required|string|max:255',
            'secondary_keywords' => 'nullable|string',
            'faqs' => 'nullable|string',
            'approval_status' => 'required|in:Awaiting Approval,Client Approved,Internally Approved',
            'published_on' => 'nullable|date',
            'ai_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $validated['created_by'] = auth()->id();

        // Convert comma-separated strings to arrays
        if (!empty($validated['secondary_keywords'])) {
            $validated['secondary_keywords'] = array_map('trim', explode(',', $validated['secondary_keywords']));
        } else {
            $validated['secondary_keywords'] = [];
        }

        if (!empty($validated['faqs'])) {
            $validated['faqs'] = array_map('trim', explode(',', $validated['faqs']));
        } else {
            $validated['faqs'] = [];
        }

        ContentFlow::create($validated);

        return redirect()->route('content-flows.index')
            ->with('success', 'Content flow created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContentFlow $contentFlow): Response
    {
        $contentFlow->load(['project:id,project_name', 'creator:id,name']);

        return Inertia::render('content-flows/show', [
            'contentFlow' => [
                'id' => $contentFlow->id,
                'title' => $contentFlow->title,
                'project_id' => $contentFlow->project_id,
                'project_name' => $contentFlow->project->project_name,
                'primary_keyword' => $contentFlow->primary_keyword,
                'secondary_keywords' => $contentFlow->secondary_keywords ?? [],
                'faqs' => $contentFlow->faqs ?? [],
                'approval_status' => $contentFlow->approval_status,
                'published_on' => $contentFlow->published_on?->format('Y-m-d'),
                'ai_score' => $contentFlow->ai_score,
                'creator_name' => $contentFlow->creator->name,
                'created_at' => $contentFlow->created_at->format('Y-m-d H:i'),
                'updated_at' => $contentFlow->updated_at->format('Y-m-d H:i'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContentFlow $contentFlow): Response
    {
        $user = auth()->user();
        $employee = $user->employee;

        // Get projects assigned to the user's employee
        $projects = Project::when($employee, function ($query) use ($employee) {
            $query->where('assigned_to', $employee->id);
        })
            ->select('id', 'project_name')
            ->orderBy('project_name')
            ->get();

        $contentFlow->load(['project:id,project_name']);

        return Inertia::render('content-flows/edit', [
            'contentFlow' => [
                'id' => $contentFlow->id,
                'title' => $contentFlow->title,
                'project_id' => $contentFlow->project_id,
                'primary_keyword' => $contentFlow->primary_keyword,
                'secondary_keywords' => is_array($contentFlow->secondary_keywords) ? implode(', ', $contentFlow->secondary_keywords) : '',
                'faqs' => is_array($contentFlow->faqs) ? implode(', ', $contentFlow->faqs) : '',
                'approval_status' => $contentFlow->approval_status,
                'published_on' => $contentFlow->published_on?->format('Y-m-d'),
                'ai_score' => $contentFlow->ai_score,
            ],
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContentFlow $contentFlow): RedirectResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'primary_keyword' => 'required|string|max:255',
            'secondary_keywords' => 'nullable|string',
            'faqs' => 'nullable|string',
            'approval_status' => 'required|in:Awaiting Approval,Client Approved,Internally Approved',
            'published_on' => 'nullable|date',
            'ai_score' => 'nullable|numeric|min:0|max:100',
        ]);

        // Convert comma-separated strings to arrays
        if (!empty($validated['secondary_keywords'])) {
            $validated['secondary_keywords'] = array_map('trim', explode(',', $validated['secondary_keywords']));
        } else {
            $validated['secondary_keywords'] = [];
        }

        if (!empty($validated['faqs'])) {
            $validated['faqs'] = array_map('trim', explode(',', $validated['faqs']));
        } else {
            $validated['faqs'] = [];
        }

        $contentFlow->update($validated);

        return redirect()->route('content-flows.show', $contentFlow)
            ->with('success', 'Content flow updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContentFlow $contentFlow): RedirectResponse
    {
        $contentFlow->delete();

        return redirect()->route('content-flows.index')
            ->with('success', 'Content flow deleted successfully.');
    }
}
