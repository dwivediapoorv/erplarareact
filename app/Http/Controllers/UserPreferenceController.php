<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    /**
     * Update or create a user preference.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'page' => ['required', 'string', 'max:255'],
            'preference_key' => ['required', 'string', 'max:255'],
            'preference_value' => ['required', 'array'],
        ]);

        UserPreference::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'page' => $validated['page'],
                'preference_key' => $validated['preference_key'],
            ],
            [
                'preference_value' => $validated['preference_value'],
            ]
        );

        // Return empty response with 200 status for Inertia
        return response('', 200);
    }
}
