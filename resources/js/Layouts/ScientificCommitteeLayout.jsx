import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import LanguageSwitcher from '../components/LanguageSwitcher';
import IdleWarningModal from '../components/IdleWarningModal';
import useIdleTimer from '../hooks/useIdleTimer';

export default function ScientificCommitteeLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showIdleWarning, setShowIdleWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const location = useLocation();
    const navigate = useNavigate();
    const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('locale') || 'ar');

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { message: 'تم تسجيل خروجك تلقائياً بسبب عدم النشاط.' } });
    }, [navigate]);

    const handleWarn = useCallback(() => {
        setShowIdleWarning(true);
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const { resetTimer } = useIdleTimer(handleWarn, handleLogout);

    const handleContinue = useCallback(() => {
        setShowIdleWarning(false);
        setCountdown(60);
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        const handleLangChange = (e) => {
            setCurrentLang(e.detail || localStorage.getItem('locale') || 'ar');
        };
        window.addEventListener('languageChanged', handleLangChange);
        return () => window.removeEventListener('languageChanged', handleLangChange);
    }, []);

    const user = (() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    })();
    const token = localStorage.getItem('token');

    const userType = user?.user_type || 'committee'; // fallback
    const hasAccess = (allowedRoles) => {
        if (!allowedRoles) return true; // if not specified, everyone can see
        if (['admin', 'chair'].includes(userType)) return true; // chair/admin sees everything
        return allowedRoles.includes(userType);
    };

    const menuItems = [
        {
            title: currentLang === 'en' ? 'Dashboard' : 'لوحة التحكم',
            icon: '📊',
            path: '/committee',
            group: currentLang === 'en' ? 'Main' : 'الرئيسية',
            allowedRoles: ['committee', 'editor', 'office']
        },
        {
            title: currentLang === 'en' ? 'Conferences' : 'إدارة المؤتمرات',
            icon: '🏛️',
            path: '/committee/conferences',
            group: currentLang === 'en' ? 'Conferences' : 'المؤتمرات',
            allowedRoles: [], // Only chair/admin
            subItems: [
                { title: currentLang === 'en' ? 'Create New' : 'إنشاء مؤتمر جديد', path: '/committee/conferences/create' },
                { title: currentLang === 'en' ? 'Edit Details' : 'تعديل بيانات المؤتمر', path: '/committee/conferences' },
                { title: currentLang === 'en' ? 'Close Conference' : 'إغلاق المؤتمر', path: '/committee/conferences' }
            ]
        },
        {
            title: currentLang === 'en' ? 'Research Management' : 'إدارة الأبحاث',
            icon: '📄',
            path: '/committee/research',
            group: currentLang === 'en' ? 'Research' : 'الأبحاث',
            allowedRoles: ['committee', 'editor', 'office'],
            subItems: [
                { title: currentLang === 'en' ? 'View Papers' : 'عرض الأبحاث', path: '/committee/research', allowedRoles: ['committee', 'editor', 'office'] },
                { title: currentLang === 'en' ? 'Sort Papers' : 'فرز الأبحاث', path: '/committee/research/sort', allowedRoles: ['committee', 'editor', 'office'] },
                { title: currentLang === 'en' ? 'Initial Decision' : 'اتخاذ القرار الأولي', path: '/committee/research/decisions', allowedRoles: ['committee'] }
            ]
        },
        {
            title: currentLang === 'en' ? 'Reviewers' : 'إدارة المحكمين',
            icon: '👨‍🏫',
            path: '/committee/reviewers',
            group: currentLang === 'en' ? 'Reviewers' : 'المحكمين',
            allowedRoles: ['committee', 'editor', 'office']
        },
        {
            title: currentLang === 'en' ? 'Review Results' : 'نتائج التحكيم',
            icon: '⚖️',
            path: '/committee/results',
            group: currentLang === 'en' ? 'Results' : 'النتائج',
            allowedRoles: ['committee'],
            subItems: [
                { title: currentLang === 'en' ? 'Review Assessments' : 'مراجعة التقييمات', path: '/committee/results' },
                { title: currentLang === 'en' ? 'Recommend Decision' : 'التوصية بالقبول/الرفض', path: '/committee/research/recommend' }
            ]
        },
        {
            title: currentLang === 'en' ? 'Sessions' : 'إدارة الجلسات',
            icon: '🕒',
            path: '/committee/sessions',
            group: currentLang === 'en' ? 'Sessions' : 'التنظيم',
            allowedRoles: ['committee'],
            subItems: [
                { title: currentLang === 'en' ? 'Create Session' : 'إنشاء جلسة', path: '/committee/sessions/create' },
                { title: currentLang === 'en' ? 'Schedule' : 'جدولة الجلسات', path: '/committee/sessions' },
                { title: currentLang === 'en' ? 'Program' : 'برنامج المؤتمر', path: '/committee/sessions/program' }
            ]
        },
        {
            title: currentLang === 'en' ? 'Certificates' : 'الشهادات',
            icon: '📜',
            path: '/committee/certificates',
            group: currentLang === 'en' ? 'Documents' : 'الوثائق',
            allowedRoles: ['office'],
            subItems: [
                { title: currentLang === 'en' ? 'Generate' : 'توليد الشهادات', path: '/committee/certificates/generate' },
                { title: currentLang === 'en' ? 'Approve' : 'اعتماد الشهادات', path: '/committee/certificates/approve' }
            ]
        },
        {
            title: currentLang === 'en' ? 'Reports' : 'التقارير',
            icon: '📈',
            path: '/committee/reports',
            group: currentLang === 'en' ? 'Statistics' : 'الإحصائيات',
            allowedRoles: ['office'],
            subItems: [
                { title: currentLang === 'en' ? 'Research Reports' : 'تقارير الأبحاث', path: '/committee/reports/research' },
                { title: currentLang === 'en' ? 'Reviewer Reports' : 'تقارير المحكمين', path: '/committee/reports/reviewers' },
                { title: currentLang === 'en' ? 'Statistics' : 'إحصائيات المؤتمر', path: '/committee/reports/stats' }
            ]
        },
        {
            title: currentLang === 'en' ? 'User Management' : 'إدارة المستخدمين',
            icon: '👥',
            path: '/committee/users',
            group: currentLang === 'en' ? 'Administration' : 'الإدارة',
            adminOnly: true,
        },
        {
            title: currentLang === 'en' ? 'Notifications' : 'الإشعارات',
            icon: '🔔',
            path: '/committee/notifications',
            group: currentLang === 'en' ? 'System' : 'النظام',
            allowedRoles: ['committee', 'editor', 'office']
        }
    ].filter(item => {
        if (item.adminOnly) return ['admin', 'chair'].includes(userType);
        return hasAccess(item.allowedRoles);
    });

    // Filter subItems as well
    menuItems.forEach(item => {
        if (item.subItems) {
            item.subItems = item.subItems.filter(sub => hasAccess(sub.allowedRoles));
        }
    });



    const isActive = (path, subItems = []) => {
        const currentPath = location.pathname;
        if (path === '/committee') return currentPath === '/committee';
        if (currentPath.startsWith(path)) return true;
        return subItems.some(sub => currentPath === sub.path);
    };

    const getActiveStyle = (path, subItems) => 
        isActive(path, subItems) 
            ? `bg-white/10 text-white shadow-lg ${currentLang === 'en' ? 'border-l-4 border-teal-400' : 'border-r-4 border-teal-400'}` 
            : 'text-gray-300 hover:bg-white/5 hover:text-white';

    const isSubActive = (path) => location.pathname === path 
        ? `text-teal-400 font-bold ${currentLang === 'en' ? 'border-l-2 pl-4 -ml-4' : 'border-r-2 pr-4 -mr-4'} border-teal-400` 
        : 'text-gray-400 hover:text-teal-400 transition';

    const getRoleName = () => {
        if (currentLang === 'en') {
            switch(user?.user_type) {
                case 'chair': return 'Conference Chair';
                case 'office': return 'Editorial Office';
                case 'production_office': return 'Production Office';
                case 'editor': return 'Scientific Editor';
                case 'admin': return 'System Administrator';
                default: return 'Scientific Committee';
            }
        } else {
            switch(user?.user_type) {
                case 'chair': return 'رئيس المؤتمر';
                case 'office': return 'مكتب التحرير';
                case 'production_office': return 'مكتب الإنتاج والنشر';
                case 'editor': return 'المحرر العلمي';
                case 'admin': return 'إدارة النظام';
                default: return 'اللجنة العلمية';
            }
        }
    };

    return (
        <>
        <IdleWarningModal
            visible={showIdleWarning}
            secondsLeft={countdown}
            onContinue={handleContinue}
            onLogout={handleLogout}
        />
        <div className={`min-h-screen bg-gray-50 flex flex-row ${currentLang === 'en' ? 'font-sans' : ''}`} style={currentLang === 'en' ? {} : { fontFamily: '"Cairo", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }} dir={currentLang === 'en' ? 'ltr' : 'rtl'}>
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-50`}
                style={{ background: '#105d82' }}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    {isSidebarOpen && (
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white truncate">
                                {getRoleName()}
                            </span>
                            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">
                                {currentLang === 'en' ? 'University of Saba Region' : 'جامعة إقليم سبأ'}
                            </span>
                            <Link to="/researcher" className="mt-2 block text-[10px] bg-white/10 text-center py-1 rounded hover:bg-white/20 transition text-white">
                                {currentLang === 'en' ? 'Researcher Panel ←' : 'دخول لوحة الباحث ←'}
                            </Link>
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
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${getActiveStyle(item.path, item.subItems)}`}
                                title={!isSidebarOpen ? item.title : ''}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="font-bold flex-1 text-sm">{item.title}</span>}
                            </Link>
                            
                            {isSidebarOpen && item.subItems && (
                                <div className={`${currentLang === 'en' ? 'ml-6 border-l pl-4' : 'mr-6 border-r pr-4'} border-teal-400/20 mt-1 space-y-1 h-auto overflow-hidden`}>
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
                        {isSidebarOpen && <span className="font-bold">{currentLang === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white h-16 shadow-sm border-b border-gray-100 flex items-center justify-end px-8 shrink-0 z-40">
                    <div className="flex items-center gap-6">
                        <LanguageSwitcher theme="light" />
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
        </>
    );
}
