<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class InteractionController extends Controller
{
    public function index(): Response
    {
        $interactions = Interaction::with('project:id,project_name')
            ->select('id', 'project_id', 'client_name', 'interaction_type', 'interaction_date', 'notes', 'outcome')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($interaction) {
                return [
                    'id' => $interaction->id,
                    'project_id' => $interaction->project_id,
                    'project_name' => $interaction->project?->project_name ?? 'N/A',
                    'client_name' => $interaction->client_name,
                    'interaction_type' => $interaction->interaction_type,
                    'interaction_date' => $interaction->interaction_date?->format('Y-m-d'),
                    'notes' => $interaction->notes,
                    'outcome' => $interaction->outcome,
                ];
            });

        return Inertia::render('client-interactions/index', [
            'interactions' => $interactions,
        ]);
    }

    public function create(): Response
    {
        // Get all projects for the dropdown
        $projects = Project::select('id', 'project_name')
            ->orderBy('project_name', 'asc')
            ->get();

        return Inertia::render('client-interactions/create', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Convert empty string to null for interaction_date
        $request->merge([
            'interaction_date' => $request->interaction_date ?: null,
        ]);

        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'client_name' => ['required', 'string', 'max:255'],
            'interaction_type' => ['required', 'string', 'max:255'],
            'interaction_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'outcome' => ['nullable', 'string', 'max:255'],
        ]);

        Interaction::create($validated);

        return redirect()->route('client-interactions.index')
            ->with('success', 'Client interaction created successfully.');
    }
}
