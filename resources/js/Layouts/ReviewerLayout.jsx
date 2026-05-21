import React, { useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import LanguageSwitcher from '../components/LanguageSwitcher';
import IdleWarningModal from '../components/IdleWarningModal';
import useIdleTimer from '../hooks/useIdleTimer';

const PRUSSIAN_GRADIENT = '#105d82';
const TURQUOISE = '#40E0D0';

export default function ReviewerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showIdleWarning, setShowIdleWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const location = useLocation();
    const navigate = useNavigate();

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

    const user = (() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) { return null; }
    })();
    const token = localStorage.getItem('token');

    const menuItems = [
        { title: 'لوحة التحكم', icon: '🏠', path: '/reviewer', group: 'عام' },
        { title: 'الأبحاث المسندة', icon: '📋', path: '/reviewer/assignments', group: 'التحكيم' },
        { title: 'الأبحاث المكتملة', icon: '✅', path: '/reviewer/completed', group: 'التحكيم' },
        { title: 'سجل التحكيم', icon: '📜', path: '/reviewer/history', group: 'التحكيم' },
        { title: 'دليل التحكيم', icon: '📚', path: '/reviewer/guidelines', group: 'الموارد' },
        { title: 'الإشعارات', icon: '🔔', path: '/reviewer/notifications', group: 'النظام' }
    ];



    const isActive = (path) => {
        if (path === '/reviewer') return location.pathname === '/reviewer';
        return location.pathname.startsWith(path);
    };

    return (
        <>
        <IdleWarningModal
            visible={showIdleWarning}
            secondsLeft={countdown}
            onContinue={handleContinue}
            onLogout={handleLogout}
        />
        <div className="min-h-screen flex flex-row bg-gray-50" style={{ fontFamily: '"Cairo", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }} dir="rtl">
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
                    <div className="px-4 pb-4 mt-3 flex flex-col items-center text-center" style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 flex items-center justify-center font-black text-xl bg-white/10" style={{ borderColor: `${TURQUOISE}60`, color: TURQUOISE }}>
                            {user?.full_name?.charAt(0) || '👤'}
                        </div>
                        <p className="text-white font-black text-sm truncate w-full">{user?.full_name || user?.name || 'مستخدم'}</p>
                        <p className="text-[10px] font-bold" style={{ color: TURQUOISE }}>محكّم علمي</p>
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
                <header className="bg-white h-16 shadow-sm border-b border-gray-100 flex items-center justify-end px-8 shrink-0 z-40">
                    <div className="flex items-center gap-6">
                        <LanguageSwitcher theme="light" />
                        <NotificationBell token={token} theme="light" />
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto"><Outlet /></div>
                </div>
            </main>
        </div>
        </>
    );
}
