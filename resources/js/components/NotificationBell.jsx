import React, { useState, useEffect, useRef, useCallback } from 'react';

const typeIcons = {
    success: '✅',
    error:   '🔴',
    info:    '💡',
    warning: '⚠️',
};

export default function NotificationBell({ token, theme = 'dark' }) {
    const [open, setOpen]               = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading]         = useState(false);
    const dropdownRef                   = useRef(null);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await fetch('/api/notifications?limit=15', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            setUnreadCount(data.unread_count ?? 0);
            setNotifications(data.notifications?.data ?? []);
        } catch (e) {
            // silent
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Poll every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { /* silent */ }
    };

    const markAllRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (e) { /* silent */ }
    };

    const formatTime = (dateStr) => {
        try {
            const date = new Date(dateStr);
            const now  = new Date();
            const diff = Math.floor((now - date) / 1000);
            if (diff < 60)    return 'الآن';
            if (diff < 3600)  return `${Math.floor(diff / 60)} دقيقة`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
            return `${Math.floor(diff / 86400)} يوم`;
        } catch {
            return '';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                type="button"
                onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
                className={`relative p-2 rounded-full transition-all duration-200 ${
                    theme === 'light' 
                        ? 'text-gray-600 hover:text-teal-600 hover:bg-gray-100' 
                        : 'text-white/80 hover:text-teal-400 hover:bg-white/10'
                }`}
                aria-label="الإشعارات"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full px-1 animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    style={{ minWidth: '320px', maxWidth: '95vw' }}
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 bg-emerald-50">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔔</span>
                            <h3 className="font-black text-emerald-950 text-sm">الإشعارات</h3>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                                    {unreadCount} جديد
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllRead}
                                className="text-xs text-teal-600 font-bold hover:text-teal-800 transition"
                            >
                                تحديد الكل كمقروء ✓
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
                        {loading && notifications.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                <div className="animate-spin text-2xl mb-2">⏳</div>
                                جاري التحميل...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">
                                <div className="text-4xl mb-3">🔔</div>
                                <p className="text-sm font-bold">لا توجد إشعارات حتى الآن</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const isUnread = !notification.read_at;
                                const data     = notification.data || {};
                                const icon     = typeIcons[data.type] || '💡';
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={(e) => {
                                            if (isUnread) markAsRead(notification.id);
                                            if (data.url) {
                                                window.location.href = data.url;
                                            }
                                        }}
                                        className={`flex gap-3 px-5 py-4 border-b border-gray-50 cursor-pointer transition-colors duration-150 group ${
                                            isUnread
                                                ? 'bg-teal-50/60 hover:bg-teal-100/50'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-lg bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                            {icon}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-snug mb-1 ${isUnread ? 'font-black text-emerald-950' : 'font-semibold text-gray-700'}`}>
                                                {data.title || 'إشعار'}
                                            </p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                                                {data.message || ''}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] text-gray-400">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
                                                )}
                                            </div>
                                        </div>
                                        {/* Link arrow */}
                                        {data.url && (
                                            <div className="shrink-0 self-center text-gray-300 group-hover:text-teal-500 transition-colors">
                                                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button
                                type="button"
                                onClick={() => { fetchNotifications(); }}
                                className="text-xs text-teal-600 font-bold hover:underline"
                            >
                                تحديث الإشعارات 🔄
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
