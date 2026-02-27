import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function ReviewerLayout() {
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

    const menuItems = [
        {
            title: 'لوحة التحكم',
            icon: '🏠',
            path: '/reviewer',
            group: 'عام'
        },
        {
            title: 'الأبحاث المسندة',
            icon: '📋',
            path: '/reviewer/assignments',
            group: 'التحكيم'
        },
        {
            title: 'الأبحاث المكتملة',
            icon: '✅',
            path: '/reviewer/completed',
            group: 'التحكيم'
        },
        {
            title: 'سجل التحكيم',
            icon: '📜',
            path: '/reviewer/history',
            group: 'التحكيم'
        },
        {
            title: 'دليل التحكيم',
            icon: '📚',
            path: '/reviewer/guidelines',
            group: 'الموارد'
        },
        {
            title: 'الإشعارات',
            icon: '🔔',
            path: '/reviewer/notifications',
            group: 'النظام'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path, subItems = []) => {
        const currentPath = location.pathname;
        if (path === '/reviewer') return currentPath === '/reviewer';
        if (currentPath.startsWith(path)) return true;
        return subItems.some(sub => currentPath === sub.path);
    };

    const getActiveStyle = (path, subItems) => 
        isActive(path, subItems) ? 'bg-indigo-900 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white';

    const isSubActive = (path) => location.pathname === path ? 'text-white font-bold border-r-2 border-white pr-4 -mr-4' : 'text-gray-400 hover:text-indigo-400 transition';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-row-reverse font-['Inter', 'Cairo', sans-serif]" dir="rtl">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-indigo-950 transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}>
                <div className="p-6 flex items-center justify-between border-b border-indigo-900/50">
                    {isSidebarOpen && (
                        <span className="text-xl font-black text-white truncate">لوحة المحكم</span>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white bg-white/10 p-2 rounded-lg hover:bg-white/20">
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <div key={idx}>
                            {isSidebarOpen && (
                                <h4 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-3 px-4">
                                    {item.group}
                                </h4>
                            )}
                            <Link 
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${getActiveStyle(item.path, item.subItems)}`}
                                title={!isSidebarOpen ? item.title : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="font-bold flex-1">{item.title}</span>}
                            </Link>
                            
                            {isSidebarOpen && item.subItems && (
                                <div className="mt-2 mr-6 border-r border-indigo-800 pr-4 space-y-1">
                                    {item.subItems.map((sub, sIdx) => (
                                        <Link 
                                            key={sIdx} 
                                            to={sub.path}
                                            className={`block py-2 text-sm transition ${isSubActive(sub.path)}`}
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-indigo-900/50">
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
                {/* Header removed as requested */}

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
