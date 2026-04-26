<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
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

        if (!$user->hasPermission($permission)) {
            return $request->expectsJson()
                ? response()->json([
                    'message'    => 'ليس لديك صلاحية للقيام بهذا الإجراء.',
                    'permission' => $permission,
                    'error_type' => 'permission_denied',
                ], 403)
                : abort(403, 'ليس لديك صلاحية للقيام بهذا الإجراء.');
        }

        return $next($request);
    }
}
