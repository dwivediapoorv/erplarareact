<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Team;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $users = User::with(['employee.team:id,name', 'employee.reportingManager:id,first_name,last_name'])
            ->select('id', 'name', 'email', 'is_active')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'first_name' => $user->employee?->first_name,
                    'last_name' => $user->employee?->last_name,
                    'phone' => $user->employee?->phone,
                    'team_label' => $user->employee?->team?->name ?? 'N/A',
                    'date_of_joining' => $user->employee?->date_of_joining?->format('Y-m-d'),
                    'date_of_exit' => $user->employee?->date_of_exit?->format('Y-m-d'),
                    'salary' => $user->employee?->salary,
                    'reporting_manager' => $user->employee?->reportingManager
                        ? $user->employee->reportingManager->first_name . ' ' . $user->employee->reportingManager->last_name
                        : null,
                    'aadhar_number' => $user->employee?->aadhar_number,
                    'pan_number' => $user->employee?->pan_number,
                    'uan_number' => $user->employee?->uan_number,
                    'account_holder_name' => $user->employee?->account_holder_name,
                    'account_number' => $user->employee?->account_number,
                    'ifsc_code' => $user->employee?->ifsc_code,
                ];
            });

        // Get user's column visibility preferences
        $columnPreferences = UserPreference::where('user_id', $request->user()->id)
            ->where('page', 'users.index')
            ->where('preference_key', 'column_visibility')
            ->first();

        return Inertia::render('users/index', [
            'users' => $users,
            'columnPreferences' => $columnPreferences?->preference_value ?? null,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $teams = Team::select('id', 'name')->get();
        $roles = Role::select('id', 'name')->get();
        $employees = Employee::select('id', 'first_name', 'last_name')->get();

        return Inertia::render('users/create', [
            'teams' => $teams,
            'roles' => $roles,
            'employees' => $employees,
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
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
            'date_of_joining' => ['nullable', 'date'],
            'date_of_exit' => ['nullable', 'date'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'reporting_manager_id' => ['nullable', 'exists:employees,id'],
            'aadhar_number' => ['nullable', 'string', 'max:255'],
            'pan_number' => ['nullable', 'string', 'max:255'],
            'uan_number' => ['nullable', 'string', 'max:255'],
            'account_holder_name' => ['nullable', 'string', 'max:255'],
            'account_number' => ['nullable', 'string', 'max:255'],
            'ifsc_code' => ['nullable', 'string', 'max:255'],
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

            // Create the employee record with all details
            Employee::create([
                'user_id' => $user->id,
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone' => $validated['phone'],
                'team_id' => $validated['team_id'],
                'date_of_joining' => $validated['date_of_joining'] ?? null,
                'date_of_exit' => $validated['date_of_exit'] ?? null,
                'salary' => $validated['salary'] ?? null,
                'reporting_manager_id' => $validated['reporting_manager_id'] ?? null,
                'aadhar_number' => $validated['aadhar_number'] ?? null,
                'pan_number' => $validated['pan_number'] ?? null,
                'uan_number' => $validated['uan_number'] ?? null,
                'account_holder_name' => $validated['account_holder_name'] ?? null,
                'account_number' => $validated['account_number'] ?? null,
                'ifsc_code' => $validated['ifsc_code'] ?? null,
            ]);

            // Assign roles to the user
            if (!empty($validated['roles'])) {
                $user->assignRole($validated['roles']);
            }

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
            // Check if is_active status is changing
            $statusChanged = $user->is_active !== $validated['is_active'];

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

            // If status changed, invalidate user's sessions to force re-login
            if ($statusChanged) {
                DB::table('sessions')
                    ->where('user_id', $user->id)
                    ->delete();
            }

            DB::commit();

            return to_route('users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('User update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update user: ' . $e->getMessage()])->withInput();
        }
    }
}
