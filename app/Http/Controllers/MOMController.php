<?php

namespace App\Http\Controllers;

use App\Models\MOM;
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
        $moms = MOM::select('id', 'title', 'description', 'meeting_date')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('minutes-of-meetings/index', [
            'moms' => $moms,
        ]);
    }

    /**
     * Show the form for creating a new minutes of meeting.
     */
    public function create(): Response
    {
        return Inertia::render('minutes-of-meetings/create');
    }

    /**
     * Store a newly created minutes of meeting in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'meeting_date' => ['nullable', 'date'],
        ]);

        MOM::create($validated);

        return to_route('minutes-of-meetings.index')->with('success', 'Minutes of Meeting created successfully.');
    }
}
