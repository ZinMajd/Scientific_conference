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
                'user_type' => 'required|in:admin,chair,author,reviewer,committee,editor,office,production_office',
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
                'email_verified_at' => now(), // Auto-verify: no email confirmation needed
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
                'production_office' => 'production_office',
            ];

            $roleSlug = $roleMap[$user->user_type] ?? 'researcher';
            $role = \App\Models\Role::where('slug', $roleSlug)->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }

            // إرسال بريد التحقق
            try {
                $user->sendEmailVerificationNotification();
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send verification email', ['error' => $e->getMessage()]);
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

        // 1. التحقق من المدخلات
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|string', // الدور القادم من واجهة تسجيل الدخول
        ]);

        $login_type = filter_var($request->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // 2. التحقق من صحة بيانات الدخول (Authentication)
        if (!Auth::attempt([$login_type => $request->login, 'password' => $request->password])) {
            \Illuminate\Support\Facades\Log::warning('Login failed - invalid credentials');
            return response()->json(['message' => 'بيانات الدخول (البريد أو كلمة المرور) غير صحيحة.'], 401);
        }

        $user = Auth::user();

        // 3. التحقق من تفعيل الحساب (Account Status Verification)
        if (!$user->is_active) {
            Auth::logout();
            return response()->json(['message' => 'تم إيقاف هذا الحساب. يرجى التواصل مع إدارة النظام.'], 403);
        }

        // 4. التحقق من تفعيل البريد الإلكتروني - معطّل (يتم التفعيل تلقائياً عند التسجيل)
        // if ($user->email_verified_at === null) {
        //     Auth::logout();
        //     return response()->json(['message' => 'يرجى تفعيل بريدك الإلكتروني أولاً.', 'needs_verification' => true], 403);
        // }


        // 5. التحقق من الدور (Role Authorization Check)
        $roleMap = [
            'إدارة النظام' => 'admin',
            'رئيس المؤتمر' => 'chair',
            'باحث' => 'author',
            'محكم' => 'reviewer',
            'اللجنة العلمية' => 'committee',
            'محرر' => 'editor',
            'مكتب التحرير' => 'office',
            'مكتب الإنتاج والنشر' => 'production_office'
        ];
        
        $expectedRole = $roleMap[$request->role] ?? null;

        if ($user->user_type !== $expectedRole) {
            Auth::logout();
            return response()->json(['message' => "هذا الحساب لا يملك صلاحيات الدخول كـ ({$request->role})."], 403);
        }

        // 6. إنشاء الجلسة والتوكن (Session & Sanctum Token)
        $request->session()->regenerate();
        $user->last_login = now();
        $user->save();

        $user->load('roles');
        $user->append('all_permissions');

        \Illuminate\Support\Facades\Log::info('User logged in successfully', ['id' => $user->id]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken,
            'message' => 'تم تسجيل الدخول بنجاح!'
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
