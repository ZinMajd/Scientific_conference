import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../Components/NotificationBell';

export default function ProductionLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const user = (() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    })();
    const token = localStorage.getItem('token');

    const menuItems = [
        {
            title: 'لوحة الإنتاج',
            icon: '🏢',
            path: '/production',
            group: 'النشر العلمي',
        },
        {
            title: 'إحصائيات النشر',
            icon: '📈',
            path: '/production/stats',
            group: 'التقارير',
        },
        {
            title: 'الإشعارات',
            icon: '🔔',
            path: '/production/notifications',
            group: 'النظام',
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const getActiveStyle = (path) => 
        isActive(path) ? 'bg-white/10 text-white shadow-lg border-r-4 border-teal-400' : 'text-gray-300 hover:bg-white/5 hover:text-white';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-row font-['Cairo', sans-serif]" dir="rtl">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}
                style={{ background: 'linear-gradient(180deg, #001a2e 0%, #003153 60%, #004472 100%)' }}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white truncate">
                                مكتب الإنتاج والنشر
                            </span>
                            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">جامعة إقليم سبأ</span>
                        </div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white bg-white/10 p-2 rounded-lg hover:bg-white/20">
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            {isSidebarOpen && (
                                <h4 className="text-[9px] uppercase tracking-[0.2em] text-teal-400/60 font-black mb-2 px-4">
                                    {item.group}
                                </h4>
                            )}
                            <Link 
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${getActiveStyle(item.path)}`}
                                title={!isSidebarOpen ? item.title : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="font-bold flex-1 text-sm">{item.title}</span>}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-emerald-900/50">
                    <div className="mb-4 px-4">
                        {isSidebarOpen && (
                            <div className="text-xs text-teal-400 font-bold mb-1 opacity-60">المستخدم الحالي:</div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                                {user?.full_name?.charAt(0) || 'P'}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="text-white text-[11px] font-bold truncate max-w-[150px]">{user?.full_name}</span>
                                    <span className="text-teal-400 text-[9px] uppercase font-black tracking-tighter">موظف إنتاج</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition"
                    >
                        <span>🚪</span>
                        {isSidebarOpen && <span className="font-bold">تسجيل الخروج</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm border-b border-gray-100 flex items-center justify-end px-8 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <NotificationBell token={token} theme="light" />
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
