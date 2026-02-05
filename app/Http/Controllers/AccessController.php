<?php

namespace App\Http\Controllers;

use App\Models\Access;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccessController extends Controller
{
    /**
     * Store a newly created access type.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:accesses,name'],
        ]);

        $access = Access::create([
            'name' => $validated['name'],
        ]);

        return response()->json([
            'id' => $access->id,
            'name' => $access->name,
        ], 201);
    }
}
