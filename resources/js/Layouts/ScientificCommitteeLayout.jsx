import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function ScientificCommitteeLayout() {
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
            icon: '📊',
            path: '/committee',
            group: 'الرئيسية'
        },
        {
            title: 'إدارة المؤتمرات',
            icon: '🏛️',
            path: '/committee/conferences',
            group: 'المؤتمرات',
            subItems: [
                { title: 'إنشاء مؤتمر جديد', path: '/committee/conferences/create' },
                { title: 'تعديل بيانات المؤتمر', path: '/committee/conferences' },
                { title: 'إغلاق المؤتمر', path: '/committee/conferences' }
            ]
        },
        {
            title: 'إدارة الأبحاث',
            icon: '📄',
            path: '/committee/research',
            group: 'الأبحاث',
            subItems: [
                { title: 'عرض الأبحاث', path: '/committee/research' },
                { title: 'فرز الأبحاث', path: '/committee/research/sort' },
                { title: 'اتخاذ القرار الأولي', path: '/committee/research/decisions' }
            ]
        },
        {
            title: 'إدارة المحكمين',
            icon: '👨‍🏫',
            path: '/committee/reviewers',
            group: 'المحكمين',
            subItems: [
                { title: 'إضافة محكم', path: '/committee/reviewers/add' },
                { title: 'تعديل بيانات محكم', path: '/committee/reviewers' },
                { title: 'إسناد الأبحاث', path: '/committee/reviewers/assign' }
            ]
        },
        {
            title: 'نتائج التحكيم',
            icon: '⚖️',
            path: '/committee/results',
            group: 'النتائج',
            subItems: [
                { title: 'مراجعة التقييمات', path: '/committee/results' },
                { title: 'التوصية بالقبول/الرفض', path: '/committee/results/recommend' }
            ]
        },
        {
            title: 'إدارة الجلسات',
            icon: '🕒',
            path: '/committee/sessions',
            group: 'التنظيم',
            subItems: [
                { title: 'إنشاء جلسة', path: '/committee/sessions/create' },
                { title: 'جدولة الجلسات', path: '/committee/sessions' },
                { title: 'برنامج المؤتمر', path: '/committee/sessions/program' }
            ]
        },
        {
            title: 'الشهادات',
            icon: '📜',
            path: '/committee/certificates',
            group: 'الوثائق',
            subItems: [
                { title: 'توليد الشهادات', path: '/committee/certificates/generate' },
                { title: 'اعتماد الشهادات', path: '/committee/certificates/approve' }
            ]
        },
        {
            title: 'التقارير',
            icon: '📈',
            path: '/committee/reports',
            group: 'الإحصائيات',
            subItems: [
                { title: 'تقارير الأبحاث', path: '/committee/reports/research' },
                { title: 'تقارير المحكمين', path: '/committee/reports/reviewers' },
                { title: 'إحصائيات المؤتمر', path: '/committee/reports/stats' }
            ]
        },
        {
            title: 'الإشعارات',
            icon: '🔔',
            path: '/committee/notifications',
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
        if (path === '/committee') return currentPath === '/committee';
        if (currentPath.startsWith(path)) return true;
        return subItems.some(sub => currentPath === sub.path);
    };

    const getActiveStyle = (path, subItems) => 
        isActive(path, subItems) ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white';

    const isSubActive = (path) => location.pathname === path ? 'text-white font-bold border-r-2 border-white pr-4 -mr-4' : 'text-gray-400 hover:text-blue-400 transition';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-row-reverse font-['Inter', 'Cairo', sans-serif]" dir="rtl">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-80' : 'w-20'} bg-blue-950 transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}>
                <div className="p-6 flex items-center justify-between border-b border-blue-900/50">
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white truncate">
                                {user?.user_type === 'chair' ? 'رئيس المؤتمر' : 
                                 user?.user_type === 'office' ? 'مكتب التحرير' : 
                                 user?.user_type === 'editor' ? 'المحرر العلمي' : 
                                 user?.user_type === 'admin' ? 'إدارة النظام' : 'اللجنة العلمية'}
                            </span>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">جامعة إقليم سبأ</span>
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
                                <h4 className="text-[9px] uppercase tracking-[0.2em] text-blue-500/60 font-black mb-2 px-4">
                                    {item.group}
                                </h4>
                            )}
                            <Link 
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${getActiveStyle(item.path, item.subItems)}`}
                                title={!isSidebarOpen ? item.title : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="font-bold flex-1 text-sm">{item.title}</span>}
                            </Link>
                            
                            {isSidebarOpen && item.subItems && (
                                <div className="mr-6 border-r border-emerald-800/50 pr-4 mt-1 space-y-1 h-auto overflow-hidden">
                                    {item.subItems.map((sub, sIdx) => (
                                        <Link 
                                            key={sIdx} 
                                            to={sub.path}
                                            className={`block py-2 text-xs transition ${isSubActive(sub.path)}`}
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-emerald-900/50">
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
