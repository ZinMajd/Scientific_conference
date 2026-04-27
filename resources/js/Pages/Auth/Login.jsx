import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GOLD = '#2dd4bf'; // Replaced Gold with Teal
const LIGHT_TEAL = '#1abc9c';
const DARK_TEAL = '#063939';
const COPPER = '#8e5a31';
const BROWN = '#3d2b1f';

export default function Login() {
    const [formData, setFormData] = useState({ login: '', password: '', role: 'باحث' });
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const roleRef = useRef(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (roleRef.current && !roleRef.current.contains(event.target)) {
                setIsRoleOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        
        try {
            const response = await axios.post('/api/login', {
                login: formData.login,
                password: formData.password,
                role: formData.role
            });

            const { user, token, message } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setSuccessMsg(message || 'تم تسجيل الدخول بنجاح!');

            const redirectTo = new URLSearchParams(location.search).get('redirect');
            if (redirectTo) { navigate(redirectTo); return; }

            const routes = {
                author: '/researcher', reviewer: '/reviewer',
                chair: '/committee', committee: '/committee',
                editor: '/committee', office: '/committee', admin: '/committee',
                production_office: '/production'
            };
            navigate(routes[user.user_type] || '/profile');

        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                const errorData = err.response.data;
                if (status === 401) setError('بيانات الدخول غير صحيحة، تأكد من اسم المستخدم وكلمة المرور.');
                else if (status === 403) setError(errorData.message);
                else if (status === 422) {
                    const validationErrors = err.response.data.errors;
                    setError(Object.values(validationErrors).flat()[0] || 'بيانات المدخلات غير صالحة');
                } else setError(errorData.message || 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.');
            } else setError('لا يوجد اتصال بالشبكة.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" 
             style={{ 
                 background: `linear-gradient(rgba(0, 26, 46, 0.65), rgba(0, 68, 114, 0.55)), url('/images/hero_conference.png')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundAttachment: 'fixed',
                 direction: 'rtl',
                 fontFamily: "'Almarai', sans-serif"
             }}>
            
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>


            <div className="w-full max-w-[480px] relative z-10 py-12">
                {/* Main Card with Outer Glow */}
                <div className="rounded-[50px] border border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
                     style={{ 
                         backdropFilter: 'blur(5px)',
                         WebkitBackdropFilter: 'blur(5px)',
                         background: 'rgba(255, 255, 255, 0.01)'
                     }}>
                    
                    {/* Header: Matching Site Header/Footer Gradient (Solid) */}
                    <div className="pt-16 pb-12 px-10 text-center border-b border-white/5 relative rounded-t-[50px] overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)' }}>




                        <div className="absolute top-0 inset-x-0 h-1"
                             style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }}></div>

                        
                        <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight"
                            style={{ 
                                background: `linear-gradient(to bottom, #FFFFFF 10%, ${GOLD} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))'
                            }}>
                            مرحباً بعودتك!
                        </h1>
                        <p className="text-white/70 text-xl font-medium opacity-90">سجل دخولك للوصول إلى لوحة التحكم</p>
                    </div>

                    {/* Form Body: Frosted Glass / Translucent Grey */}
                    <div className="px-12 py-14" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                        {error && (
                            <div className="mb-8 p-5 rounded-2xl text-sm font-bold bg-red-500/20 border border-red-500/30 text-red-100 flex items-center gap-4">
                                <span className="text-xl">⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Custom Glass Dropdown for Role */}
                            <div className="relative" ref={roleRef}>
                                <label className="block font-bold mb-3 mr-1 text-sm tracking-wider" style={{ color: '#2dd4bf' }}>نوع الحساب</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-white flex items-center justify-between outline-none focus:border-white/40 focus:bg-white/20 transition-all font-bold text-lg"
                                    style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                                >
                                    <span>{formData.role}</span>
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                </button>

                                {isRoleOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-[100]"
                                         style={{ 
                                             backdropFilter: 'blur(30px)', 
                                             WebkitBackdropFilter: 'blur(30px)',
                                             background: 'rgba(0, 26, 46, 0.95)',
                                             maxHeight: '400px',
                                             overflowY: 'auto'
                                         }}>

                                        {['باحث', 'محكم', 'إدارة النظام', 'رئيس المؤتمر', 'اللجنة العلمية', 'محرر', 'مكتب التحرير', 'مكتب الإنتاج والنشر'].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, role });
                                                    setIsRoleOpen(false);
                                                }}
                                                className="w-full px-6 py-4 text-right transition-colors font-bold border-b border-white/10 last:border-none hover:bg-white/10 text-white"
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                )}

                            </div>


                            {/* Login Field */}
                            <div>
                                <label className="block font-bold mb-3 mr-1 text-sm tracking-wider" style={{ color: '#2dd4bf' }}>اسم المستخدم أو البريد</label>
                                <input 
                                    type="text" 
                                    name="login" 
                                    value={formData.login} 
                                    onChange={handleChange}
                                    placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                                    required
                                    autoComplete="off"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#1abc9c]/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-lg"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block font-bold mb-3 mr-1 text-sm tracking-wider" style={{ color: '#2dd4bf' }}>كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type={showPass ? 'text' : 'password'} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange}
                                        placeholder="........"
                                        required
                                        autoComplete="new-password"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#1abc9c]/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-lg"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <Link to="/forgot-password" user-id="forgot-password-link" className="text-white/60 text-sm hover:text-white transition-colors font-medium border-b border-transparent hover:border-white/30">
                                        نسيت كلمة المرور؟
                                    </Link>
                                    <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] animate-pulse"></div>
                                </div>
                            </div>

                            {/* Submit Button: Light Teal & Gold Shine */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-10 group relative overflow-hidden rounded-[30px] transition-all active:scale-[0.97] disabled:opacity-50"
                                style={{ 
                                    background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)',
                                    boxShadow: '0 20px 40px -10px rgba(0, 49, 83, 0.5)'
                                }}
                            >
                                <div className="py-5.5 flex items-center justify-center gap-5 text-white font-black text-2xl relative z-10">
                                    {loading ? (
                                        <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <span className="tracking-widest">تسجيل الدخول</span>
                                            <span className="text-4xl transition-transform group-hover:translate-x-[-8px]">→</span>
                                        </>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors"></div>
                                <div className="absolute top-0 left-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                     style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }}></div>
                            </button>
                        </form>

                        <div className="mt-16 text-center">
                            <span className="text-white/60 font-medium">ليس لديك حساب؟ </span>
                            <Link to="/register" className="text-white font-black hover:text-[#2dd4bf] transition-colors border-b-2 border-white/10 hover:border-[#2dd4bf]">
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Subtle outer glow for the card */}
                <div className="absolute -inset-2 -z-10 rounded-[40px] blur-[60px]"
                     style={{ background: `linear-gradient(to bottom right, rgba(0, 49, 83, 0.4), rgba(26, 188, 156, 0.3))` }}></div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');
                input::placeholder {
                    text-align: right;
                }
                select option {
                    background: #1a0f0a;
                    color: white;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}


