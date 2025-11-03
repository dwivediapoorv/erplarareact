<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(): Response
    {
        $services = Services::select('id', 'name')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('services/index', [
            'services' => $services,
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create(): Response
    {
        return Inertia::render('services/create');
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Services::create($validated);

        return to_route('services.index')->with('success', 'Service created successfully.');
    }
}
