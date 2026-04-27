<?php

namespace App\Http\Controllers;

use App\Models\SupportMessage;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        SupportMessage::create($validated);

        return response()->json([
            'message' => 'تم استلام رسالتك بنجاح. سنقوم بالرد عليك في أقرب وقت ممكن.',
        ], 201);
    }
}
