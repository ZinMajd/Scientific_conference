import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const OCEAN = '#0096c7';
const GOLD = '#2dd4bf'; // Replaced Gold with Teal

export default function Login() {
    const [formData, setFormData] = useState({ login: '', password: '', role: 'باحث' });
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const roleRef = useRef(null);
    const [error, setError] = useState('');
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
            setError(''); // clear error if there's redirect message
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post('/api/login', {
                login: formData.login,
                password: formData.password,
                role: formData.role
            });

            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

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
        <div className="min-h-screen flex flex-col lg:flex-row" 
             style={{ 
                 direction: 'rtl',
                 fontFamily: "'Almarai', sans-serif",
                 backgroundColor: '#f8fafc'
             }}>
            
            {/* الجهة اليمنى: صورة الرئيسية */}
            <div className="hidden lg:block lg:w-[57%] relative bg-[#001a2e]">
                <img src="/images/hero_conference.png" alt="University Conference" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-[#001a2e]/70"></div>
                <div className="absolute inset-0 bg-[#0096c7] mix-blend-multiply opacity-20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-8">
                    <h2 className="text-5xl font-bold mb-4 font-['Cairo'] leading-tight drop-shadow-lg text-center">بوابة البحث العلمي والمؤتمرات</h2>
                    <p className="text-2xl text-teal-400 font-semibold drop-shadow-md text-center">جامعة إقليم سبأ</p>
                </div>
            </div>

            {/* الجهة اليسرى: نافذة تسجيل الدخول (بكامل الارتفاع) */}
            <div className="w-full lg:w-[43%] flex flex-col justify-center items-center relative overflow-hidden bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20 h-full min-h-screen">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: OCEAN }}></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: GOLD }}></div>

                <div className="w-full max-w-[460px] mx-auto px-6 py-8 animate-fade-in relative z-10 flex flex-col justify-center my-auto space-y-6">
                    
                    {/* Header */}
                    <div className="text-center mb-2">
                        <h1 className="text-4xl font-bold mb-1 font-['Cairo'] tracking-wide" style={{ color: PRUSSIAN_DARK }}>تسجيل الدخول</h1>
                    </div>

                    <div className="w-full">
                        {error && (
                            <div className="mb-4 p-4 rounded-full text-sm font-bold bg-rose-50 border border-rose-200 text-rose-700 animate-shake text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
                            {/* Custom Dropdown for Role */}
                            <div className="relative" ref={roleRef}>
                                <label className="block text-sm font-medium text-slate-600 mb-4 text-center">نوع الحساب</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-none text-slate-800 flex items-center justify-center outline-none transition-all duration-300 font-normal focus:border-sky-500 hover:border-slate-300 text-center cursor-pointer relative"
                                >
                                    <span>{formData.role}</span>
                                    <svg className={`w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                    </svg>
                                </button>

                                {isRoleOpen && (
                                    <div className="absolute top-full left-0 w-full mt-1 rounded-none border border-slate-200 bg-white p-2 shadow-2xl"
                                         style={{ 
                                             zIndex: 100,
                                             maxHeight: '250px',
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
                                                className="w-full mb-1.5 py-3 text-center font-bold border border-slate-300 rounded-none bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-500 text-slate-800 cursor-pointer transition-all duration-200 block"
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Login Field */}
                            <div style={{ marginTop: '70px' }}>
                                <label className="block text-sm font-medium text-slate-600 mb-4 text-center">اسم المستخدم أو البريد الإلكتروني</label>
                                <input 
                                    type="text" 
                                    name="login" 
                                    value={formData.login} 
                                    onChange={handleChange}
                                    placeholder="khalid.alyemeni@univ.edu.ye"
                                    required
                                    autoComplete="off"
                                    className="w-full px-6 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 placeholder:text-slate-300 text-center"
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* Password Field */}
                            <div style={{ marginTop: '70px' }}>
                                <label className="block text-sm font-medium text-slate-600 mb-4 text-center">كلمة المرور</label>
                                <div className="relative">
                                    <input 
                                        type={showPass ? 'text' : 'password'} 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange}
                                        placeholder="••••••••••••"
                                        required
                                        autoComplete="new-password"
                                        className="w-full pl-12 pr-6 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 placeholder:text-slate-300 text-center"
                                        style={{ direction: 'ltr' }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot Password */}
                            <div className="flex items-center justify-between px-2" style={{ marginTop: '55px' }}>
                                <label className="flex items-center text-sm font-medium text-slate-500 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 ml-2 accent-sky-600 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer" 
                                    />
                                    <span>تذكرني</span>
                                </label>
                                <Link to="/forgot-password" data-user-id="forgot-password-link" className="text-sky-600 text-sm hover:text-sky-700 transition-colors font-medium">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <div style={{ marginTop: '55px' }}>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 rounded-none text-white font-bold text-lg shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-70 cursor-pointer"
                                    style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)' }}
                                >
                                    {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-slate-500 font-normal text-sm">
                            ليس لديك حساب حتى الآن؟{' '}
                            <Link to="/register" className="font-medium hover:underline transition-colors text-sky-600">
                                أنشئ حسابك الجديد الآن
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
                input::placeholder {
                    text-align: center;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(0, 49, 83, 0.2);
                }
            `}</style>
        </div>
    );
}


