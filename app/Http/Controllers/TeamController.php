<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display a listing of teams.
     */
    public function index(): Response
    {
        $teams = Team::select('id', 'name')
            ->withCount([
                'employees as active_users_count' => function ($query) {
                    $query->whereHas('user', function ($q) {
                        $q->where('is_active', true);
                    });
                }
            ])
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('teams/index', [
            'teams' => $teams,
        ]);
    }

    /**
     * Show the form for creating a new team.
     */
    public function create(): Response
    {
        return Inertia::render('teams/create');
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Team::create($validated);

        return to_route('teams.index')->with('success', 'Team created successfully.');
    }

    /**
     * Display the specified team with its members.
     */
    public function show(Team $team): Response
    {
        $team->load([
            'employees' => function ($query) {
                $query->with('user:id,email,is_active')
                    ->select('employees.id', 'employees.team_id', 'employees.first_name', 'employees.last_name', 'employees.user_id');
            }
        ]);

        $members = $team->employees->map(function ($employee) {
            return [
                'id' => $employee->id,
                'name' => $employee->first_name . ' ' . $employee->last_name,
                'email' => $employee->user?->email ?? 'N/A',
                'is_active' => $employee->user?->is_active ?? false,
            ];
        });

        return Inertia::render('teams/show', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'members' => $members,
        ]);
    }
}
