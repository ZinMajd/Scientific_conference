import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../Components/NotificationBell';

const PRUSSIAN_GRADIENT = 'linear-gradient(180deg, #001a2e 0%, #003153 60%, #004472 100%)';
const TURQUOISE = '#40E0D0';

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
    const token = localStorage.getItem('token');

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
        { title: 'الأبحاث المحكمة', icon: '✅', path: '/researcher/reviewed', group: 'الأبحاث ' }, // Added space to group name to force separate header if needed
        { title: 'سجل التحكيم', icon: '📜', path: '/researcher/reviews', group: 'الأبحاث  ' }, // Added space
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
            ? { background: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRight: `4px solid ${TURQUOISE}` }
            : {};

    const getActiveClass = (path, subItems) =>
        isActive(path, subItems)
            ? 'text-white font-bold shadow-lg bg-white/5'
            : 'text-white/60 hover:text-white hover:bg-white/10';

    const isSubActive = (path) => location.pathname === path
        ? `text-white font-bold border-r-2 pr-3 bg-white/5`
        : 'text-white/50 hover:text-[#40E0D0] transition hover:pr-1';

    const isSubActiveBorder = (path) => location.pathname === path
        ? { borderColor: TURQUOISE }
        : {};

    return (
        <div className="min-h-screen flex flex-row bg-gray-50" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}
                style={{ background: PRUSSIAN_GRADIENT, borderLeft: `1px solid ${TURQUOISE}20` }}>

                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                    {isSidebarOpen && (
                        <div>
                            <span className="text-xl font-black text-white block tracking-tight">لوحة الباحث</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: TURQUOISE }}>Researcher Panel</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95"
                        style={{ background: `${TURQUOISE}20`, color: TURQUOISE }}>
                        {isSidebarOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* User Info */}
                {isSidebarOpen && user && (
                    <div className="mx-5 mt-6 p-4 rounded-2xl" style={{ background: `${TURQUOISE}10`, border: `1px solid ${TURQUOISE}25` }}>
                        <p className="text-white font-black text-base truncate mb-0.5">{user?.full_name || user?.name || 'مستخدم'}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-80" style={{ color: TURQUOISE }}>
                            {user?.user_type === 'editor' ? 'المحرر العلمي' : 
                             user?.user_type === 'chair' ? 'رئيس المؤتمر' : 
                             user?.user_type === 'office' ? 'مكتب التحرير' : 
                             user?.user_type === 'admin' ? 'مدير النظام' : 'باحث علمي'}
                        </p>
                        {['editor', 'chair', 'office', 'admin'].includes(user?.user_type) && (
                            <Link to="/committee" className="mt-3 block text-[10px] bg-white/10 text-center py-2 rounded-lg hover:bg-white/20 transition text-white font-bold">
                                العودة للوحة الإدارة ←
                            </Link>
                        )}
                    </div>
                )}

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2 custom-scrollbar">
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            {isSidebarOpen && (idx === 0 || item.group !== menuItems[idx-1].group) && (
                                <h4 className="text-[10px] uppercase tracking-[0.25em] font-black mb-1 mt-4 px-4 opacity-40" style={{ color: TURQUOISE }}>
                                    {item.group}
                                </h4>
                            )}
                            <Link
                                to={item.path}
                                className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 ${getActiveClass(item.path, item.subItems)}`}
                                style={getActiveStyle(item.path, item.subItems)}
                                title={!isSidebarOpen ? item.title : ''}>
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="font-bold flex-1 text-[13px]">{item.title}</span>}
                            </Link>
                            {isSidebarOpen && item.subItems && (
                                <div className="mt-1.5 mr-8 pr-5 space-y-1" style={{ borderRight: `2px solid ${TURQUOISE}20` }}>
                                    {item.subItems.map((sub, sIdx) => (
                                        <Link
                                            key={sIdx}
                                            to={sub.path}
                                            className={`block py-2.5 px-3 text-xs rounded-xl transition-all duration-200 ${isSubActive(sub.path)}`}
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
                {/* Top Header */}
                <header className="bg-white h-16 shadow-sm border-b border-gray-100 flex items-center justify-end px-8 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <NotificationBell token={token} theme="light" />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
