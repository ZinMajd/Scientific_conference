import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const isActive = (path) => location.pathname === path ? 'text-blue-300 font-bold underline' : 'text-blue-100 hover:text-white transition';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex flex-col font-cairo" dir="rtl">
            {/* Header */}
            <header className="bg-blue-950 shadow-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-blue-400/20">
                            <img 
                                src="https://pbs.twimg.com/profile_images/856860265249415168/v2K_v4x-_400x400.jpg" 
                                alt="جامعة إقليم سبأ" 
                                className="w-10 h-10 object-contain rounded-full"
                            />
                         </div>
                         <h1 className="text-xl font-bold text-white tracking-wide">
                             جامعة إقليم سبأ
                         </h1>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6 items-center text-xs lg:text-sm">
                        <Link to="/" className={isActive('/')}>الرئيسية</Link>
                        <Link to="/conferences" className={isActive('/conferences')}>المؤتمرات</Link>
                        <Link to="/about" className={isActive('/about')}>عن النظام</Link>
                        <Link to="/faq" className={isActive('/faq')}>الأسئلة الشائعة</Link>
                        <Link to="/support" className={isActive('/support')}>الدعم</Link>
                        {user && <Link to="/profile" className={isActive('/profile')}>لوحة التحكم</Link>}
                    </nav>

                    {/* Auth Actions */}
                    <div className="hidden md:flex gap-3 items-center text-sm">
                        {!user ? (
                            <>
                                <Link to="/login" className="px-4 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition border border-transparent hover:border-white/20">
                                    تسجيل الدخول
                                </Link>
                                <Link to="/register" className="px-4 py-2 text-white font-medium hover:bg-white/10 rounded-lg transition border border-transparent hover:border-white/20">
                                    إنشاء حساب
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-blue-100 font-medium">{user?.full_name || user?.name || 'مستخدم'}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-red-300 font-medium hover:bg-red-500/10 rounded-lg transition"
                                >
                                    خروج
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-blue-900 border-t border-blue-800 p-4 flex flex-col gap-3 shadow-2xl">
                        <Link to="/" className="p-2 text-white hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
                        <Link to="/conferences" className="p-2 text-white hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>المؤتمرات</Link>
                        <Link to="/about" className="p-2 text-white hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>عن النظام</Link>
                        <Link to="/faq" className="p-2 text-white hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>الأسئلة الشائعة</Link>
                        <Link to="/support" className="p-2 text-white hover:bg-blue-800 rounded" onClick={() => setIsMenuOpen(false)}>الدعم</Link>
                        {!user && <Link to="/login" className="p-2 text-center border border-white text-white rounded" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="grow bg-gray-50">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-blue-950 text-blue-100 py-12 mt-auto border-t border-blue-900">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-right">
                    <div>
                        <h3 className="text-white font-bold text-xl mb-6">نظام المؤتمرات العلمية</h3>
                        <p className="text-sm leading-relaxed text-blue-200/80">
                             منصة متكاملة لإدارة المؤتمرات العلمية، من تقديم الأوراق البحثية إلى النشر والتحكيم والاعتمادات.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/conferences" className="hover:text-white transition">المؤتمرات المتاحة</Link></li>
                            <li><Link to="/support" className="hover:text-white transition">الأسئلة الشائعة</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">تسجيل الباحثين</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">تواصل معنا</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 justify-center md:justify-start">
                                <span>📧</span>
                                <a href="mailto:info@sabauni.edu.ye" className="hover:text-white transition">info@sabauni.edu.ye</a>
                            </li>
                            <li className="flex items-center gap-2 justify-center md:justify-start">
                                <span>🌐</span>
                                <a href="https://sabauni.edu.ye" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">sabauni.edu.ye</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-sm text-blue-300/50 mt-12 pt-8 border-t border-blue-900/50">
                    2026 جامعة إقليم سبأ - جميع الحقوق محفوظة
                </div>
            </footer>
        </div>
    );
}
