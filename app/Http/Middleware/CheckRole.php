<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return $request->expectsJson()
                ? response()->json(['message' => 'غير مصرح. يجب تسجيل الدخول.'], 401)
                : redirect('/login');
        }

        // مدير النظام يمتلك صلاحية مطلقة
        if ($user->hasRole('system_admin')) {
            return $next($request);
        }

        // Laravel يمرر "a,b,c" كـ string واحد — نقوم بتفكيكها
        $allRoles = [];
        foreach ($roles as $role) {
            foreach (explode(',', $role) as $r) {
                $allRoles[] = trim($r);
            }
        }

        // التحقق إذا كان المستخدم يمتلك أحد الأدوار المطلوبة
        foreach ($allRoles as $requiredRole) {
            if ($user->hasRole($requiredRole)) {
                return $next($request);
            }
        }

        return $request->expectsJson()
            ? response()->json([
                'message'    => 'ليس لديك الدور المطلوب للقيام بهذا الإجراء.',
                'required'   => $allRoles,
                'your_roles' => $user->roles->pluck('slug'),
                'error_type' => 'role_denied',
            ], 403)
            : abort(403, 'ليس لديك الدور المطلوب للقيام بهذا الإجراء.');
    }
}
