import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from '../Components/NotificationBell';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    
    // Language Dropdown State
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('ar');

    const switchLanguage = (langCode) => {
        // 1. Instantly trigger Google Translate BEFORE React re-renders
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
        
        // 2. Update React State
        setCurrentLang(langCode);
        setLangMenuOpen(false);
        
        // 3. Keep the cookie updated in the background
        document.cookie = `googtrans=/ar/${langCode}; path=/`;
        document.cookie = `googtrans=/ar/${langCode}; path=/; domain=${window.location.hostname}`;
    };

    // Keep user state in sync with localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const saved = localStorage.getItem('user');
                setUser(saved ? JSON.parse(saved) : null);
                setToken(localStorage.getItem('token') || null);
            } catch (e) {
                setUser(null);
                setToken(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Use useCallback to stabilize the isActive function
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        closeMenu();
        navigate('/');
    }, [navigate, closeMenu]);

    const getLinkClass = useCallback((path) => {
        const isActive = location.pathname === path;
        return isActive 
            ? 'text-teal-400 font-bold border-b-2 border-teal-400 pb-1'
            : 'text-white/90 hover:text-teal-400 transition-colors duration-200';
    }, [location.pathname]);

    const isDashboardPath = useCallback(() => {
        return ['/profile', '/researcher', '/committee', '/reviewer'].some(p => location.pathname.startsWith(p));
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            <style>{`
                /* Hide ALL Google Translate Artifacts */
                body { top: 0px !important; position: static !important; }
                
                /* Hide the top banner and tooltips */
                .skiptranslate iframe,
                iframe.goog-te-banner-frame,
                iframe.goog-te-balloon-frame,
                .goog-te-banner-frame,
                .goog-te-balloon-frame,
                #goog-gt-tt,
                .goog-tooltip {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }
                
                /* Hide obfuscated modern Google translate classes */
                .VIpgJd-Zvi9od-ORhb-OEVmcd,
                .VIpgJd-Zvi9od-aZ2wEe-wOHMyf,
                .VIpgJd-Zvi9od-aZ2wEe-OiiCO {
                    display: none !important;
                }

                /* Disable text highlight */
                .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; border: none !important; }
            `}</style>
            {/* Header */}
            <header style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)' }}
                className="shadow-2xl sticky top-0 z-50 border-b border-teal-400/20">
                <div className="w-full px-4 lg:px-8 py-3 flex items-center justify-between min-h-[80px]">
                    {/* Logo Section - Right Side */}
                    <div className="flex items-center gap-3 z-20 w-[20%] xl:w-[25%]">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-none flex items-center justify-center overflow-hidden shadow-lg border-2 border-teal-400/40 shrink-0">
                            <img src="/images/saba_logo.gif" alt="جامعة إقليم سبأ" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden xl:block">
                            <h1 className="text-lg font-black text-white tracking-wide leading-tight whitespace-nowrap">جامعة إقليم سبأ</h1>
                            <p className="text-[10px] text-teal-400 font-bold tracking-widest uppercase whitespace-nowrap">نظام المؤتمرات العلمية</p>
                        </div>
                    </div>

                    {/* Desktop Nav - Centered perfectly */}
                    <nav className="hidden lg:flex gap-4 xl:gap-6 items-center justify-center text-[15px] xl:text-[17px] font-bold whitespace-nowrap flex-1">
                        <Link to="/" className={getLinkClass('/')}>الرئيسية</Link>
                        <Link to="/conferences" className={getLinkClass('/conferences')}>المؤتمرات</Link>
                        <Link to="/about" className={getLinkClass('/about')}>عن النظام</Link>
                        <Link to="/faq" className={getLinkClass('/faq')}>الأسئلة الشائعة</Link>
                        <Link to="/support" className={getLinkClass('/support')}>الدعم</Link>
                        {user && (
                            <Link 
                                to={
                                    user.user_type === 'author' ? '/researcher' : 
                                    ['admin', 'chair', 'editor', 'office', 'committee'].includes(user.user_type) ? '/committee' : 
                                    user.user_type === 'reviewer' ? '/reviewer' : '/profile'
                                } 
                                className={
                                    isDashboardPath()
                                    ? 'text-teal-400 font-bold border-b-2 border-teal-400 pb-1'
                                    : 'text-white/90 hover:text-teal-400 transition-colors duration-200'
                                }
                            >
                                لوحة التحكم
                            </Link>
                        )}
                    </nav>

                    {/* Auth Actions & Language - Left Side */}
                    <div className="hidden md:flex items-center justify-end gap-4 xl:gap-6 text-[15px] xl:text-[17px] font-bold w-[20%] xl:w-[25%] z-20">
                        {!user ? (
                            <>
                                <Link to="/login" className={getLinkClass('/login')}>
                                    تسجيل الدخول
                                </Link>
                                <Link to="/register" className={getLinkClass('/register')}>
                                    إنشاء حساب
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <NotificationBell token={token} />
                                <span className="text-teal-400 font-bold text-base">{user?.full_name || user?.name || 'مستخدم'}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-red-300 font-bold hover:bg-red-500/10 border-2 border-red-400/20 hover:border-red-400/50 rounded-none transition-all">
                                    خروج
                                </button>
                            </div>
                        )}

                        {/* Language Switcher Dropdown (Placed last to be on the far left in RTL) */}
                        <div className="relative notranslate">
                            <button 
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="flex items-center gap-1 text-white/90 hover:text-teal-400 transition-colors duration-200"
                            >
                                {currentLang === 'en' ? 'عربي' : 'English'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {langMenuOpen && (
                                <div className="absolute top-full left-0 mt-3 bg-white rounded-none shadow-xl overflow-hidden min-w-[140px] z-50 flex flex-col border border-gray-100">
                                    <button 
                                        onClick={() => switchLanguage('en')}
                                        style={{ color: 'black' }}
                                        className={`px-4 py-3 text-base font-bold text-center hover:bg-teal-50 transition-colors ${currentLang === 'en' ? 'bg-teal-50/50' : ''}`}
                                    >
                                        English
                                    </button>
                                    <button 
                                        onClick={() => switchLanguage('ar')}
                                        style={{ color: 'black' }}
                                        className={`px-4 py-3 text-base font-bold text-center hover:bg-teal-50 transition-colors border-t border-gray-100 ${currentLang === 'ar' ? 'bg-teal-50/50' : ''}`}
                                    >
                                        عربي
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Absolute Left on Mobile */}
                    <button 
                        className="md:hidden p-2 text-teal-400 absolute left-4" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="القائمة الرئيسية"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-teal-400/20 p-4 flex flex-col gap-2"
                        style={{ background: '#001a2e' }}>
                        <Link to="/" className="p-3 text-white hover:text-teal-400 hover:bg-white/5 rounded-none transition" onClick={closeMenu}>الرئيسية</Link>
                        <Link to="/conferences" className="p-3 text-white hover:text-teal-400 hover:bg-white/5 rounded-none transition" onClick={closeMenu}>المؤتمرات</Link>
                        <Link to="/about" className="p-3 text-white hover:text-teal-400 hover:bg-white/5 rounded-none transition" onClick={closeMenu}>عن النظام</Link>
                        <Link to="/faq" className="p-3 text-white hover:text-teal-400 hover:bg-white/5 rounded-none transition" onClick={closeMenu}>الأسئلة الشائعة</Link>
                        <Link to="/support" className="p-3 text-white hover:text-teal-400 hover:bg-white/5 rounded-none transition" onClick={closeMenu}>الدعم</Link>
                        {!user && (
                            <Link to="/login" className="p-3 text-center border border-teal-400/40 text-teal-400 rounded-none" onClick={closeMenu}>
                                تسجيل الدخول
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="grow bg-white">
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 100%)' }}
                className="text-white/70 py-12 mt-auto border-t border-teal-400/20">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-right">
                    <div>
                        <h3 className="text-white font-bold text-xl mb-4">نظام المؤتمرات العلمية</h3>
                        <div className="w-12 h-0.5 mb-4 rounded-none" style={{ background: '#40E0D0' }}></div>
                        <p className="text-sm leading-relaxed text-white/60">
                            منصة متكاملة لإدارة المؤتمرات العلمية، من تقديم الأوراق البحثية إلى النشر والتحكيم والاعتمادات.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
                        <div className="w-12 h-0.5 mb-4 rounded-none" style={{ background: '#40E0D0' }}></div>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/conferences" className="hover:text-teal-400 transition-colors">المؤتمرات المتاحة</Link></li>
                            <li><Link to="/support" className="hover:text-teal-400 transition-colors">الأسئلة الشائعة</Link></li>
                            <li><Link to="/login" className="hover:text-teal-400 transition-colors">تسجيل الباحثين</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">تواصل معنا</h3>
                        <div className="w-12 h-0.5 mb-4 rounded-none" style={{ background: '#40E0D0' }}></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="text-teal-400" role="img" aria-label="بريد إلكتروني">📧</span>
                                <a href="mailto:info@sabauni.edu.ye" className="hover:text-teal-400 transition-colors">info@sabauni.edu.ye</a>
                            </li>
                            <li className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="text-teal-400" role="img" aria-label="موقع إلكتروني">🌐</span>
                                <a href="https://sabauni.edu.ye" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">sabauni.edu.ye</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-sm text-white/30 mt-10 pt-6 border-t border-teal-400/10">
                    © 2026 جامعة إقليم سبأ - جميع الحقوق محفوظة
                </div>
            </footer>
        </div>
    );
}
