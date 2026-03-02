<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conference;
use Illuminate\Http\Request;

class ConferenceController extends Controller
{
    public function index()
    {
        return Conference::whereIn('status', ['open', 'reviewing'])->orderBy('start_date', 'asc')->get();
    }

    public function show($id)
    {
        return Conference::findOrFail($id);
    }

    public function committeeIndex()
    {
        return Conference::withCount([
            'papers',
            'attendees as authors_count' => function ($query) {
                $query->where('registration_type', 'author');
            }
        ])->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:200',
                'description' => 'required|string',
                'venue' => 'required|string|max:200',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'submission_deadline' => 'required|date',
                'review_deadline' => 'required|date|after_or_equal:submission_deadline',
                'notification_date' => 'required|date|after_or_equal:review_deadline',
                'status' => 'required|in:draft,open,reviewing,closed,archived',
                'short_name' => 'nullable|string|max:50',
                'website_url' => 'nullable|url',
                'contact_email' => 'nullable|email',
                'registration_fee' => 'nullable|numeric|min:0',
                'max_papers' => 'nullable|integer|min:1',
                'camera_ready_deadline' => 'nullable|date|after_or_equal:notification_date',
                'registration_deadline' => 'nullable|date|after_or_equal:start_date',
            ]);

            $validated['chair_id'] = $request->user()->id;

            $conference = Conference::create($validated);

            return response()->json($conference, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Conference Creation Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create conference: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $conference = Conference::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'venue' => 'required|string|max:200',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'submission_deadline' => 'required|date',
            'review_deadline' => 'required|date|after_or_equal:submission_deadline',
            'notification_date' => 'required|date|after_or_equal:review_deadline',
            'status' => 'required|in:draft,open,reviewing,closed,archived',
            'short_name' => 'nullable|string|max:50',
            'website_url' => 'nullable|url',
            'contact_email' => 'nullable|email',
            'registration_fee' => 'nullable|numeric|min:0',
            'max_papers' => 'nullable|integer|min:1',
            'camera_ready_deadline' => 'nullable|date|after_or_equal:notification_date',
            'registration_deadline' => 'nullable|date',
        ]);

        $conference->update($request->all());

        return response()->json($conference);
    }

    public function destroy($id)
    {
        $conference = Conference::findOrFail($id);
        $conference->delete();
        return response()->json(['message' => 'Conference deleted successfully']);
    }
}
