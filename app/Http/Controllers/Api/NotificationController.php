<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $limit = $request->input('limit', 20);
        $notifications = $user->notifications()->paginate($limit);

        return response()->json([
            'unread_count' => $user->unreadNotifications()->count(),
            'notifications' => $notifications
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'تم التحديد كمقروء']);
        }

        return response()->json(['message' => 'الإشعار غير موجود'], 404);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'تم تحديد جميع الإشعارات كمقروءة']);
    }
}
