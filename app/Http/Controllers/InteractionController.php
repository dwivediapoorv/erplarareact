<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class InteractionController extends Controller
{
    public function index(): Response
    {
        $interactions = Interaction::select('id', 'client_name', 'interaction_type', 'interaction_date', 'notes', 'outcome')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('client-interactions/index', [
            'interactions' => $interactions,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('client-interactions/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
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
