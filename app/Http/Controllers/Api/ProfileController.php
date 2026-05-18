<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'affiliation' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user->fill([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'affiliation' => $validated['affiliation'],
            'phone' => $validated['phone'],
            'bio' => $validated['bio'],
        ]);

        if ($request->hasFile('profile_image')) {
            // Delete old image if exists
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            
            $path = $request->file('profile_image')->store('profile-photos', 'public');
            $user->profile_image = $path;
        }

        $user->save();

        // Load roles to keep the frontend state consistent
        $user->load('roles');
        $user->append('all_permissions');

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
