# DigiRocket ERP

A modern, full-stack ERP system for managing projects, employees, tasks, and finances.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Frontend** | React 19 + TypeScript 5.7 |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 4 + Radix UI |
| **Database** | SQLite/PostgreSQL/MySQL |
| **Auth** | Laravel Fortify (2FA support) |
| **Permissions** | Spatie Permission (RBAC) |
| **Excel** | Maatwebsite Excel |
| **Routing** | Inertia.js + Wayfinder (type-safe routes) |

## Main Modules

1. **User & Employee Management** - Profiles, identification docs (Aadhar, PAN, UAN), bank details, reporting hierarchy
2. **Project Management** - Client projects with health status (Red/Green/Orange), assignments, services
3. **Task Management** - Workflow: Pending → Completed → Approved
4. **Team Management** - Team organization and employee assignments
5. **Payments** - General payment tracking
6. **Project Activities** - Minutes of Meeting, Client Interactions, Content Flow (SEO planning)
7. **Permission Management** - Granular permissions, role-based access control
8. **Settings** - Profile, Password, 2FA, Theme (light/dark)

## Project Structure

```
app/
├── Http/Controllers/        # 26 controllers (resource-based CRUD)
├── Models/                  # 18 Eloquent models
├── Providers/               # FortifyServiceProvider, AppServiceProvider
└── Actions/Fortify/         # Authentication actions

database/
├── migrations/              # 21 migration files
└── seeders/                 # HRSeeder, RoleAndPermissionSeeder, etc.

resources/js/
├── pages/                   # 50+ React page components
├── components/              # 26 reusable UI components
├── layouts/                 # AppLayout, AuthLayout, SelfServiceLayout, SettingsLayout
├── app.tsx                  # Inertia app setup
└── ssr.tsx                  # Server-side rendering

routes/
├── web.php                  # Main route definitions
└── settings.php             # Settings routes
```

## Key Models & Relationships

- **User** → has one Employee
- **Employee** → belongs to Team
- **Project** → belongs to many Services, has many Tasks, MOMs, Interactions, ContentFlows
- **Task** → belongs to Project, assigned to Employee, approved by Employee

## Database Tables

- `users`, `employees`, `teams`, `projects`, `tasks`
- `services`, `project_service`, `accesses`, `project_access`
- `payments`, `m_o_m_s`, `interactions`, `content_flows`
- `roles`, `permissions`, `role_has_permissions`, `model_has_roles`, `model_has_permissions`
- `user_preferences`

## Conventions

### Backend
- Resource controllers with standard CRUD (index, create, store, show, edit, update, destroy)
- Permission middleware on routes: `middleware('permission:view users')`
- Eloquent relationships with proper foreign keys and cascading
- Form Request classes for validation

### Frontend
- Inertia.js for server-driven SPA
- TypeScript strict mode
- Wayfinder for type-safe route generation
- Radix UI + Tailwind for accessible, styled components
- Dark/Light theme support via appearance context

### Naming
- Controllers: `{Resource}Controller.php`
- Models: Singular `{Resource}.php`
- Pages: `resources/js/pages/{resource}/index.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`
- Routes: RESTful (`/projects`, `/projects/{project}`, `/projects/{project}/edit`)

## Common Commands

```bash
# Development
npm run dev              # Start Vite dev server
php artisan serve        # Start Laravel server

# Database
php artisan migrate      # Run migrations
php artisan db:seed      # Seed database

# Build
npm run build            # Production build

# Testing
php artisan test         # Run Pest tests
```

## Environment

- Main branch: `main`
- PHP 8.2+ required
- Node.js for frontend build
