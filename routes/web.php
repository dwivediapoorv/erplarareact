<?php

use App\Http\Controllers\Admin\LeaveRequestController as AdminLeaveRequestController;
use App\Http\Controllers\Admin\SalarySlipController as AdminSalarySlipController;
use App\Http\Controllers\ContentFlowController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\MOMController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SalarySlipController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Ex-employee page (no active middleware)
    Route::inertia('ex-employee', 'inactive')->name('ex-employee');
});

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User routes
    Route::get('users', [UserController::class, 'index'])->middleware('permission:view users')->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->middleware('permission:create users')->name('users.create');
    Route::post('users', [UserController::class, 'store'])->middleware('permission:create users')->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:view users')->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->middleware('permission:edit users')->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:edit users')->name('users.update');

    // Employee routes (admin view all employees)
    Route::get('employees', [EmployeeController::class, 'index'])->middleware('permission:view employees')->name('employees.index');

    // Team routes
    Route::get('teams', [TeamController::class, 'index'])->middleware('permission:view teams')->name('teams.index');
    Route::get('teams/create', [TeamController::class, 'create'])->middleware('permission:create teams')->name('teams.create');
    Route::post('teams', [TeamController::class, 'store'])->middleware('permission:create teams')->name('teams.store');
    Route::get('teams/{team}', [TeamController::class, 'show'])->middleware('permission:view teams')->name('teams.show');

    // Service routes
    Route::get('services', [ServicesController::class, 'index'])->middleware('permission:view services')->name('services.index');
    Route::get('services/create', [ServicesController::class, 'create'])->middleware('permission:create services')->name('services.create');
    Route::post('services', [ServicesController::class, 'store'])->middleware('permission:create services')->name('services.store');

    // Project routes
    Route::get('projects', [ProjectController::class, 'index'])->middleware('permission:view projects')->name('projects.index');
    Route::get('projects/assigned', [ProjectController::class, 'assignedProjects'])->middleware('permission:view projects')->name('projects.assigned');
    Route::get('projects/assigned-to/{employee}', [ProjectController::class, 'byAssignedTo'])->middleware('permission:view projects')->name('projects.by-assigned-to');
    Route::get('projects/managed-by/{employee}', [ProjectController::class, 'byProjectManager'])->middleware('permission:view projects')->name('projects.by-project-manager');
    Route::get('projects/create', [ProjectController::class, 'create'])->middleware('permission:create projects')->name('projects.create');
    Route::post('projects', [ProjectController::class, 'store'])->middleware('permission:create projects')->name('projects.store');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->middleware('permission:view projects')->name('projects.show');
    Route::get('projects/{project}/edit', [ProjectController::class, 'edit'])->middleware('permission:edit projects')->name('projects.edit');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->middleware('permission:edit projects')->name('projects.update');

    // Task routes
    Route::get('tasks', [TaskController::class, 'index'])->middleware('permission:view tasks')->name('tasks.index');
    Route::get('tasks/create', [TaskController::class, 'create'])->middleware('permission:create tasks')->name('tasks.create');
    Route::post('tasks', [TaskController::class, 'store'])->middleware('permission:create tasks')->name('tasks.store');
    Route::get('tasks/{task}', [TaskController::class, 'show'])->middleware('permission:view tasks')->name('tasks.show');
    Route::get('tasks/{task}/edit', [TaskController::class, 'edit'])->middleware('permission:edit tasks')->name('tasks.edit');
    Route::put('tasks/{task}', [TaskController::class, 'update'])->middleware('permission:edit tasks')->name('tasks.update');
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete'])->middleware('permission:complete tasks')->name('tasks.complete');
    Route::patch('tasks/{task}/approve', [TaskController::class, 'approve'])->middleware('permission:approve tasks')->name('tasks.approve');

    // Minutes of Meetings routes
    Route::get('minutes-of-meetings', [MOMController::class, 'index'])->middleware('permission:view minutes-of-meetings')->name('minutes-of-meetings.index');
    Route::get('minutes-of-meetings/create', [MOMController::class, 'create'])->middleware('permission:create minutes-of-meetings')->name('minutes-of-meetings.create');
    Route::post('minutes-of-meetings', [MOMController::class, 'store'])->middleware('permission:create minutes-of-meetings')->name('minutes-of-meetings.store');

    // Payroll routes
    Route::get('payroll', [PayrollController::class, 'index'])->middleware('permission:view payrolls')->name('payroll.index');
    Route::get('payroll/create', [PayrollController::class, 'create'])->middleware('permission:create payrolls')->name('payroll.create');
    Route::post('payroll', [PayrollController::class, 'store'])->middleware('permission:create payrolls')->name('payroll.store');

    // Payment routes
    Route::get('payments', [PaymentController::class, 'index'])->middleware('permission:view payments')->name('payments.index');
    Route::get('payments/create', [PaymentController::class, 'create'])->middleware('permission:create payments')->name('payments.create');
    Route::post('payments', [PaymentController::class, 'store'])->middleware('permission:create payments')->name('payments.store');

    // Client Interaction routes
    Route::get('client-interactions', [InteractionController::class, 'index'])->middleware('permission:view client-interactions')->name('client-interactions.index');
    Route::get('client-interactions/create', [InteractionController::class, 'create'])->middleware('permission:create client-interactions')->name('client-interactions.create');
    Route::post('client-interactions', [InteractionController::class, 'store'])->middleware('permission:create client-interactions')->name('client-interactions.store');

    // Content Flow routes
    Route::get('content-flows', [ContentFlowController::class, 'index'])->name('content-flows.index');
    Route::get('content-flows/by-project/{project}', [ContentFlowController::class, 'byProject'])->name('content-flows.by-project');
    Route::get('content-flows/create', [ContentFlowController::class, 'create'])->name('content-flows.create');
    Route::post('content-flows', [ContentFlowController::class, 'store'])->name('content-flows.store');
    Route::get('content-flows/{contentFlow}', [ContentFlowController::class, 'show'])->name('content-flows.show');
    Route::get('content-flows/{contentFlow}/edit', [ContentFlowController::class, 'edit'])->name('content-flows.edit');
    Route::put('content-flows/{contentFlow}', [ContentFlowController::class, 'update'])->name('content-flows.update');
    Route::delete('content-flows/{contentFlow}', [ContentFlowController::class, 'destroy'])->name('content-flows.destroy');

    // Permissions management routes
    Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:manage permissions')->name('permissions.index');

    // Role CRUD routes
    Route::post('permissions/roles', [PermissionController::class, 'storeRole'])->middleware('permission:manage permissions')->name('permissions.roles.store');
    Route::patch('permissions/roles/{role}', [PermissionController::class, 'updateRolePermissions'])->middleware('permission:manage permissions')->name('permissions.roles.update');
    Route::put('permissions/roles/{role}/name', [PermissionController::class, 'updateRoleName'])->middleware('permission:manage permissions')->name('permissions.roles.update-name');
    Route::delete('permissions/roles/{role}', [PermissionController::class, 'deleteRole'])->middleware('permission:manage permissions')->name('permissions.roles.delete');

    // User permissions routes
    Route::patch('permissions/users/{user}/permissions', [PermissionController::class, 'updateUserPermissions'])->middleware('permission:manage permissions')->name('permissions.users.permissions.update');
    Route::patch('permissions/users/{user}/roles', [PermissionController::class, 'assignRoles'])->middleware('permission:assign roles')->name('permissions.users.roles.update');

    // User preferences route
    Route::post('user-preferences', [UserPreferenceController::class, 'update'])->name('user-preferences.update');

    // Employee routes (self-service)
    Route::get('employee/my-details', [EmployeeController::class, 'myDetails'])->name('employee.my-details');
    Route::get('employee/salary-slips', [SalarySlipController::class, 'index'])->name('employee.salary-slips');
    Route::get('employee/salary-slips/{salarySlip}/view', [SalarySlipController::class, 'view'])->name('employee.salary-slips.view');
    Route::get('employee/salary-slips/{salarySlip}/download', [SalarySlipController::class, 'download'])->name('employee.salary-slips.download');

    // Leave Request routes (self-service)
    Route::get('leave-requests', [LeaveController::class, 'index'])->name('leave-requests.index');
    Route::get('leave-requests/create', [LeaveController::class, 'create'])->name('leave-requests.create');
    Route::post('leave-requests', [LeaveController::class, 'store'])->name('leave-requests.store');
    Route::post('leave-requests/calculate-days', [LeaveController::class, 'calculateDays'])->name('leave-requests.calculate-days');
    Route::delete('leave-requests/{leaveRequest}', [LeaveController::class, 'destroy'])->name('leave-requests.destroy');

    // Organization Calendar / Holiday routes
    Route::get('calendar', [HolidayController::class, 'index'])->name('calendar.index');
    Route::get('calendar/create', [HolidayController::class, 'create'])->middleware('permission:create holidays')->name('calendar.create');
    Route::post('calendar', [HolidayController::class, 'store'])->middleware('permission:create holidays')->name('calendar.store');
    Route::delete('calendar/{holiday}', [HolidayController::class, 'destroy'])->middleware('permission:delete holidays')->name('calendar.destroy');

    // Admin Salary Slip Management routes
    Route::get('admin/salary-slips', [AdminSalarySlipController::class, 'index'])->middleware('permission:view salary-slips')->name('admin.salary-slips.index');
    Route::post('admin/salary-slips/generate', [AdminSalarySlipController::class, 'generate'])->middleware('permission:generate salary-slips')->name('admin.salary-slips.generate');
    Route::delete('admin/salary-slips/{salarySlip}', [AdminSalarySlipController::class, 'destroy'])->middleware('permission:delete salary-slips')->name('admin.salary-slips.destroy');

    // Admin Leave Request Management routes
    Route::get('admin/leave-requests', [AdminLeaveRequestController::class, 'index'])->middleware('permission:view leave-requests')->name('admin.leave-requests.index');
    Route::post('admin/leave-requests/{leaveRequest}/approve', [AdminLeaveRequestController::class, 'approve'])->middleware('permission:approve leave-requests')->name('admin.leave-requests.approve');
    Route::post('admin/leave-requests/{leaveRequest}/reject', [AdminLeaveRequestController::class, 'reject'])->middleware('permission:reject leave-requests')->name('admin.leave-requests.reject');
});

require __DIR__.'/settings.php';
