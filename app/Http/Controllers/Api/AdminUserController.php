<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminUserController extends Controller
{
    // Mapping from user_type to role slug
    private array $roleMap = [
        'admin'             => 'system_admin',
        'chair'             => 'conference_chair',
        'committee'         => 'scientific_committee',
        'editor'            => 'editor',
        'office'            => 'editorial_office',
        'reviewer'          => 'reviewer',
        'production_office' => 'production_office',
        'author'            => 'researcher',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = User::query()->with('roles');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_type') && $request->user_type !== 'all') {
            $query->where('user_type', $request->user_type);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'full_name'  => 'required|string|max:255',
            'username'   => 'required|string|max:100|unique:users,username',
            'email'      => 'required|email|unique:users,email',
            'password'   => ['required', 'string', Password::min(8)],
            'user_type'  => 'required|in:chair,committee,editor,office,reviewer,production_office', // 'admin' removed
            'affiliation'=> 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:30',
        ]);

        $user = User::create([
            'full_name'         => $data['full_name'],
            'username'          => $data['username'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'user_type'         => $data['user_type'],
            'affiliation'       => $data['affiliation'] ?? null,
            'phone'             => $data['phone'] ?? null,
            'is_active'         => \Illuminate\Support\Facades\DB::raw('true'),
            'email_verified_at' => now(),
        ]);

        // Attach the corresponding role
        $roleSlug = $this->roleMap[$data['user_type']] ?? null;
        if ($roleSlug) {
            $role = Role::query()->where('slug', $roleSlug)->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }
        }

        $user->load('roles');

        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح.',
            'user'    => $user,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        if ($user->username === 'asih' && $request->filled('user_type') && $request->user_type !== 'admin') {
            return response()->json([
                'message' => 'لا يمكن تغيير دور مدير النظام الرئيسي (asih).'
            ], 422);
        }

        $data = $request->validate([
            'full_name'  => 'sometimes|string|max:255',
            'email'      => "sometimes|email|unique:users,email,{$id}",
            'username'   => "sometimes|string|max:100|unique:users,username,{$id}",
            'password'   => ['nullable', 'string', Password::min(8)],
            'user_type'  => 'sometimes|in:chair,committee,editor,office,reviewer,production_office,author', // 'admin' removed
            'is_active'  => 'sometimes|boolean',
            'affiliation'=> 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:30',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        // Re-sync role if user_type changed
        if ($request->filled('user_type')) {
            $roleSlug = $this->roleMap[$data['user_type']] ?? null;
            if ($roleSlug) {
                $role = Role::query()->where('slug', $roleSlug)->first();
                if ($role) {
                    $user->roles()->sync([$role->id]);
                }
            }
        }

        $user->load('roles');

        return response()->json([
            'message' => 'تم تحديث بيانات المستخدم بنجاح.',
            'user'    => $user,
        ]);
    }

    public function toggleActive(int $id): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        if ($user->username === 'asih') {
            return response()->json([
                'message' => 'لا يمكن إيقاف حساب مدير النظام الرئيسي (asih).'
            ], 422);
        }
        
        $newState = !$user->is_active;
        $user->is_active = $newState;
        
        // Use raw query for Postgres boolean update to prevent type mismatch
        User::query()->where('id', $id)->update([
            'is_active' => \Illuminate\Support\Facades\DB::raw($newState ? 'true' : 'false')
        ]);

        return response()->json([
            'message'   => $newState ? 'تم تفعيل الحساب.' : 'تم إيقاف الحساب.',
            'is_active' => $newState,
        ]);
    }
}
