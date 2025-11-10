<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow access to logout and ex-employee routes
        if ($request->routeIs('logout') || $request->routeIs('ex-employee')) {
            return $next($request);
        }

        // Check if user is authenticated and inactive
        if ($request->user() && !$request->user()->is_active) {
            // Redirect to ex-employee page
            return redirect()->route('ex-employee');
        }

        return $next($request);
    }
}
