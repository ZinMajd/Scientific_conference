import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function ResearcherLayout() {
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
        { title: 'لوحة التحكم', icon: '🏠', path: '/researcher', group: 'عام' },
        {
            title: 'المؤتمرات المسجل بها', icon: '📅', path: '/researcher/conferences', group: 'المؤتمرات',
            subItems: [
                { title: 'التسجيل في مؤتمر', path: '/conferences' },
                { title: 'إلغاء التسجيل', path: '/researcher/conferences' }
            ]
        },
        {
            title: 'إدارة الأبحاث', icon: '📄', path: '/researcher/research', group: 'الأبحاث',
            subItems: [
                { title: 'تقديم بحث جديد', path: '/researcher/research/create' },
                { title: 'أبحاثي', path: '/researcher/research' },
                { title: 'حالة البحث', path: '/researcher/research' }
            ]
        },
        { title: 'الأبحاث المحكمة', icon: '✅', path: '/researcher/reviewed', group: 'الأبحاث' },
        { title: 'سجل التحكيم', icon: '📜', path: '/researcher/reviews', group: 'الأبحاث' },
        {
            title: 'الشهادات', icon: '🎓', path: '/researcher/certificates', group: 'الوثائق',
            subItems: [
                { title: 'شهادة مشاركة', path: '/researcher/certificates/participation' },
                { title: 'شهادة قبول بحث', path: '/researcher/certificates/acceptance' }
            ]
        },
        { title: 'الإشعارات', icon: '🔔', path: '/researcher/notifications', group: 'النظام' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path, subItems = []) => {
        const currentPath = location.pathname;
        if (path === '/researcher') return currentPath === '/researcher';
        if (currentPath.startsWith(path)) return true;
        return subItems?.some(sub => currentPath === sub.path);
    };

    const getActiveStyle = (path, subItems) =>
        isActive(path, subItems)
            ? { background: `linear-gradient(135deg, ${OCEAN}, ${TURQUOISE}20)`, color: 'white', boxShadow: `0 4px 15px ${TURQUOISE}30` }
            : {};

    const getActiveClass = (path, subItems) =>
        isActive(path, subItems)
            ? 'text-white font-bold'
            : 'text-white/60 hover:text-white hover:bg-white/10';

    const isSubActive = (path) => location.pathname === path
        ? `text-white font-bold border-r-2 pr-3`
        : 'text-white/50 hover:text-[#40E0D0] transition';

    const isSubActiveBorder = (path) => location.pathname === path
        ? { borderColor: TURQUOISE }
        : {};

    return (
        <div className="min-h-screen flex flex-row-reverse" style={{ fontFamily: "'Cairo', sans-serif", background: '#f0fafa' }} dir="rtl">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}
                style={{ background: `linear-gradient(180deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 100%)`, borderLeft: `1px solid ${TURQUOISE}20` }}>

                {/* Logo Area */}
                <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                    {isSidebarOpen && (
                        <div>
                            <span className="text-lg font-black text-white block">لوحة الباحث</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TURQUOISE }}>Researcher Panel</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg transition-all"
                        style={{ background: `${TURQUOISE}20`, color: TURQUOISE }}>
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* User Info */}
                {isSidebarOpen && user && (
                    <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: `${TURQUOISE}10`, border: `1px solid ${TURQUOISE}25` }}>
                        <p className="text-white font-bold text-sm truncate">{user?.full_name || user?.name || 'مستخدم'}</p>
                        <p className="text-xs" style={{ color: TURQUOISE }}>باحث علمي</p>
                    </div>
                )}

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <div key={idx}>
                            {isSidebarOpen && (
                                <h4 className="text-[9px] uppercase tracking-[0.2em] font-black mb-1 mt-4 px-3 opacity-50" style={{ color: TURQUOISE }}>
                                    {item.group}
                                </h4>
                            )}
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${getActiveClass(item.path, item.subItems)}`}
                                style={getActiveStyle(item.path, item.subItems)}
                                title={!isSidebarOpen ? item.title : ''}>
                                <span className="text-lg">{item.icon}</span>
                                {isSidebarOpen && <span className="font-semibold flex-1 text-sm">{item.title}</span>}
                            </Link>
                            {isSidebarOpen && item.subItems && (
                                <div className="mt-1 mr-6 pr-4 space-y-0.5" style={{ borderRight: `2px solid ${TURQUOISE}30` }}>
                                    {item.subItems.map((sub, sIdx) => (
                                        <Link
                                            key={sIdx}
                                            to={sub.path}
                                            className={`block py-2 px-2 text-xs rounded transition ${isSubActive(sub.path)}`}
                                            style={isSubActiveBorder(sub.path)}>
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <div className="p-4" style={{ borderTop: `1px solid ${TURQUOISE}20` }}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-red-300 hover:bg-red-400/10 rounded-xl transition-all">
                        <span>🚪</span>
                        {isSidebarOpen && <span className="font-bold text-sm">تسجيل الخروج</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8" style={{ background: '#f0fafa' }}>
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
