import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const PRUSSIAN_GRADIENT = 'linear-gradient(180deg, #001a2e 0%, #003153 60%, #004472 100%)';
const TURQUOISE = '#40E0D0';

export default function ReviewerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const user = (() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    })();

    const menuItems = [
        { title: 'لوحة التحكم', icon: '🏠', path: '/reviewer', group: 'عام' },
        { title: 'الأبحاث المسندة', icon: '📋', path: '/reviewer/assignments', group: 'التحكيم' },
        { title: 'الأبحاث المكتملة', icon: '✅', path: '/reviewer/completed', group: 'التحكيم' },
        { title: 'سجل التحكيم', icon: '📜', path: '/reviewer/history', group: 'التحكيم' },
        { title: 'دليل التحكيم', icon: '📚', path: '/reviewer/guidelines', group: 'الموارد' },
        { title: 'الإشعارات', icon: '🔔', path: '/reviewer/notifications', group: 'النظام' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/reviewer') return location.pathname === '/reviewer';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen flex flex-row-reverse bg-gray-50" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}
                style={{ background: PRUSSIAN_GRADIENT, borderLeft: `1px solid ${TURQUOISE}20` }}>
                <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                    {isSidebarOpen && (
                        <div>
                            <span className="text-lg font-black text-white block">لوحة المحكم</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TURQUOISE }}>Reviewer Panel</span>
                        </div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg transition-all"
                        style={{ background: `${TURQUOISE}20`, color: TURQUOISE }}>
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {isSidebarOpen && user && (
                    <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: `${TURQUOISE}10`, border: `1px solid ${TURQUOISE}25` }}>
                        <p className="text-white font-bold text-sm truncate">{user?.full_name || user?.name || 'مستخدم'}</p>
                        <p className="text-xs" style={{ color: TURQUOISE }}>محكّم علمي</p>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <div key={idx}>
                            {isSidebarOpen && (
                                <h4 className="text-[9px] uppercase tracking-[0.2em] font-black mb-1 mt-4 px-3 opacity-50" style={{ color: TURQUOISE }}>
                                    {item.group}
                                </h4>
                            )}
                            <Link to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive(item.path) ? 'text-white font-bold bg-white/10 border-r-4 border-teal-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                style={{}}
                                title={!isSidebarOpen ? item.title : ''}>
                                <span className="text-lg">{item.icon}</span>
                                {isSidebarOpen && <span className="font-semibold flex-1 text-sm">{item.title}</span>}
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="p-4" style={{ borderTop: `1px solid ${TURQUOISE}20` }}>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-red-300 hover:bg-red-400/10 rounded-xl transition-all">
                        <span>🚪</span>
                        {isSidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto"><Outlet /></div>
                </div>
            </main>
        </div>
    );
}
