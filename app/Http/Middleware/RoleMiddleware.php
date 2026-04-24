<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $rolesArray = explode('|', $roles);
        $userRoles = $request->user()->roles->pluck('slug')->toArray();
        $userType = $request->user()->user_type;

        // Check if user has at least one of the required roles or matching user_type
        $hasRole = false;
        foreach ($rolesArray as $role) {
            if (in_array($role, $userRoles) || $role === $userType) {
                $hasRole = true;
                break;
            }
        }

        // System Admin has access to everything
        if (in_array('system_admin', $userRoles)) {
            $hasRole = true;
        }

        if (!$hasRole) {
            return response()->json([
                'message' => 'غير مصرح لك بالوصول إلى هذا الجزء من النظام.',
                'required_roles' => $rolesArray,
                'user_roles' => $userRoles
            ], 403);
        }

        return $next($request);
    }
}
