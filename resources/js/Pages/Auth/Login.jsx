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
        <div className="min-h-screen flex items-center justify-center py-8 px-4" 
             style={{ 
                 direction: 'rtl',
                 fontFamily: "'Almarai', sans-serif",
                 background: `linear-gradient(135deg, ${PRUSSIAN_DARK}08 0%, #40E0D010 100%)`
             }}>
            
            <div className="w-full max-w-[480px] bg-white rounded-none shadow-2xl overflow-hidden animate-fade-in"
                 style={{ border: `1px solid #40E0D030` }}>
                
                {/* Header: Solid blue/teal gradient matching Register */}
                <div className="py-12 px-8 text-center text-white"
                     style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                    <h1 className="text-3xl font-black mb-2 font-['Cairo']">مرحباً بعودتك!</h1>
                    <p className="text-white/70 text-sm font-bold">سجل دخولك للوصول إلى لوحة التحكم</p>
                </div>

                <div className="px-8 pt-10 pb-10">
                    {error && (
                        <div className="mb-8 p-5 rounded-none text-sm font-bold bg-rose-50 border-r-4 border-rose-500 text-rose-700 animate-shake">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Custom Dropdown for Role */}
                        <div className="relative" ref={roleRef}>
                            <label className="block text-xl font-['Cairo'] font-black uppercase tracking-widest mr-1 mb-2" style={{ color: PRUSSIAN }}>نوع الحساب</label>
                            <button 
                                type="button"
                                onClick={() => setIsRoleOpen(!isRoleOpen)}
                                className="w-full px-8 py-5 text-xl bg-gray-50 border rounded-none text-gray-700 flex items-center justify-between outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                            >
                                <span>{formData.role}</span>
                                <svg className={`w-5 h-5 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`} viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </button>

                            {isRoleOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 rounded-none overflow-hidden border border-gray-200 shadow-2xl"
                                     style={{ 
                                         zIndex: 100,
                                         background: '#ffffff',
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
                                            className="w-full px-6 py-4 text-right transition-colors font-bold border-b border-gray-100 last:border-none hover:bg-gray-50 text-gray-800"
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Login Field */}
                        <div className="space-y-2">
                            <label className="block text-xl font-['Cairo'] font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>اسم المستخدم أو البريد</label>
                            <input 
                                type="text" 
                                name="login" 
                                value={formData.login} 
                                onChange={handleChange}
                                placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                                required
                                autoComplete="off"
                                className="w-full px-8 py-5 text-xl bg-gray-50 border rounded-none outline-none transition-all duration-300 font-bold focus:bg-white placeholder:text-gray-400"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-xl font-['Cairo'] font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>كلمة المرور</label>
                            <div className="relative">
                                <input 
                                    type={showPass ? 'text' : 'password'} 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-8 py-5 text-xl bg-gray-50 border rounded-none outline-none transition-all duration-300 font-bold focus:bg-white placeholder:text-gray-400"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-3">
                                <Link to="/forgot-password" data-user-id="forgot-password-link" className="text-gray-400 text-sm hover:text-gray-600 transition-colors font-bold border-b border-transparent hover:border-gray-300">
                                    نسيت كلمة المرور؟
                                </Link>
                                <div className="w-2.5 h-2.5 rounded-none bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] animate-pulse"></div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-5 rounded-none text-white font-black text-xl shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
                                style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}
                            >
                                {loading ? 'جاري التحميل...' : 'تسجيل الدخول ←'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 font-bold">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="font-black hover:underline" style={{ color: OCEAN }}>
                                إنشاء حساب جديد
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');
                input::placeholder {
                    text-align: right;
                }
                select option {
                    background: #ffffff;
                    color: #333333;
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


