<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendeeController extends Controller
{
    /**
     * Register the authenticated user as an attendee for a conference.
     */
    public function register(Request $request, $id)
    {
        $conference = Conference::findOrFail($id);
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'يجب تسجيل الدخول أولاً'], 401);
        }

        // Check if already registered
        $existing = Attendee::where('conf_id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->first();

        if ($existing) {
            return response()->json(['message' => 'أنت مسجل بالفعل في هذا المؤتمر'], 400);
        }

        $attendee = Attendee::create([
            'user_id' => $user->id,
            'conf_id' => $conference->id,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'affiliation' => $user->affiliation,
            'registration_type' => 'participant', // Default type
            'payment_status' => 'pending',
            'payment_amount' => $conference->registration_fee,
        ]);

        return response()->json([
            'message' => 'تم التسجيل كحضور بنجاح',
            'attendee' => $attendee
        ]);
    }

    /**
     * Check if the authenticated user is registered for a conference.
     */
    public function checkRegistration($id)
    {
        $user = Auth::user();
        if (!$user)
            return response()->json(['registered' => false]);

        $exists = Attendee::where('conf_id', $id)
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('email', $user->email);
            })
            ->exists();

        return response()->json(['registered' => $exists]);
    }
}
