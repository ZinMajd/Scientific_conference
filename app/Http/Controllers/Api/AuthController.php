<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ReviewerExpertise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Registration attempt', ['data' => $request->except('password')]);
        try {
            $data = $request->validate([
                'username' => 'required|string|unique:users',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6',
                'full_name' => 'required|string',
                'user_type' => 'required|in:admin,chair,author,reviewer,committee,editor,office',
                'affiliation' => 'nullable|string|max:200',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'bio' => 'nullable|string',
                // Reviewer specific fields
                'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
                'expertise' => 'nullable|array',
                'expertise.*.topic_id' => 'required|exists:topics,id',
                'expertise.*.proficiency' => 'required|in:beginner,intermediate,expert',
            ]);

            $cvPath = null;
            if ($request->hasFile('cv_file')) {
                $cvPath = $request->file('cv_file')->store('cvs', 'public');
            }

            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'full_name' => $data['full_name'],
                'user_type' => $data['user_type'],
                'affiliation' => $data['affiliation'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'bio' => $data['bio'] ?? null,
                'cv_path' => $cvPath,
            ]);

            // Save expertise if user is a reviewer
            if ($user->user_type === 'reviewer' && isset($data['expertise'])) {
                foreach ($data['expertise'] as $exp) {
                    ReviewerExpertise::create([
                        'reviewer_id' => $user->id,
                        'topic_id' => $exp['topic_id'],
                        'proficiency_level' => $exp['proficiency']
                    ]);
                }
            }

            // Automatically attach role based on user_type
            $roleMap = [
                'author' => 'researcher',
                'reviewer' => 'reviewer',
                'committee' => 'scientific_committee',
                'chair' => 'conference_chair',
                'office' => 'editorial_office',
                'editor' => 'editor',
                'admin' => 'system_admin',
            ];

            $roleSlug = $roleMap[$user->user_type] ?? 'researcher';
            $role = \App\Models\Role::where('slug', $roleSlug)->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }

            \Illuminate\Support\Facades\Log::info('User created successfully', ['id' => $user->id]);

            Auth::login($user);
            $request->session()->regenerate();

            $user->load('roles', 'permissions'); // Preload for attribute
            $user->append('all_permissions');

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('auth_token')->plainTextToken
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'فشل إنشاء الحساب: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Login attempt', ['login' => $request->login]);

        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $login_type = filter_var($request->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (!Auth::attempt([$login_type => $request->login, 'password' => $request->password])) {
            \Illuminate\Support\Facades\Log::warning('Login failed - invalid credentials');
            return response()->json(['message' => 'بيانات الدخول غير صحيحة'], 401);
        }

        $request->session()->regenerate();
        $user = Auth::user();
        \Illuminate\Support\Facades\Log::info('User logged in', ['id' => $user->id]);

        $user->load('roles');
        $user->append('all_permissions');

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }

    public function logout(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Logout attempt', ['id' => auth()->id()]);
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
