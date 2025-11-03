<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): Response
    {
        $users = User::with(['employee.team:id,name'])
            ->select('id', 'name', 'email', 'is_active')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'team_label' => $user->employee?->team?->name ?? 'N/A',
                ];
            });

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $teams = Team::select('id', 'name')->get();

        return Inertia::render('users/create', [
            'teams' => $teams,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:employees'],
            'team_id' => ['required', 'exists:teams,id'],
        ]);

        DB::beginTransaction();

        try {
            // Concatenate first name and last name to create full name
            $fullName = $validated['first_name'] . ' ' . $validated['last_name'];

            // Create the user with default password
            $user = User::create([
                'name' => $fullName,
                'email' => $validated['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            // Create the employee record with team assignment
            Employee::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'team_id' => $validated['team_id'],
            ]);

            DB::commit();

            return to_route('users.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('User creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create user: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load(['employee.team:id,name']);

        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'first_name' => $user->employee?->first_name,
                'last_name' => $user->employee?->last_name,
                'phone' => $user->employee?->phone,
                'team_id' => $user->employee?->team_id,
                'team_name' => $user->employee?->team?->name ?? 'N/A',
                'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load('employee');
        $teams = Team::select('id', 'name')->get();

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'first_name' => $user->employee?->first_name,
                'last_name' => $user->employee?->last_name,
                'phone' => $user->employee?->phone,
                'team_id' => $user->employee?->team_id,
            ],
            'teams' => $teams,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'unique:employees,phone,' . $user->employee?->id],
            'team_id' => ['required', 'exists:teams,id'],
            'is_active' => ['required', 'boolean'],
        ]);

        DB::beginTransaction();

        try {
            // Concatenate first name and last name to create full name
            $fullName = $validated['first_name'] . ' ' . $validated['last_name'];

            // Update the user
            $user->update([
                'name' => $fullName,
                'email' => $validated['email'],
                'is_active' => $validated['is_active'],
            ]);

            // Update the employee record
            $user->employee->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'team_id' => $validated['team_id'],
            ]);

            DB::commit();

            return to_route('users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('User update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update user: ' . $e->getMessage()])->withInput();
        }
    }
}
