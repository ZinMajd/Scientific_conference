import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Login() {
    const [formData, setFormData] = useState({ login: '', password: '', role: 'باحث' });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
            if (location.state.username) setFormData(prev => ({ ...prev, login: location.state.username }));
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
                password: formData.password
            });

            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            const redirectTo = new URLSearchParams(location.search).get('redirect');
            if (redirectTo) { navigate(redirectTo); return; }

            const routes = {
                author: '/researcher', reviewer: '/reviewer',
                chair: '/committee', committee: '/committee',
                editor: '/committee', office: '/committee', admin: '/committee'
            };
            navigate(routes[user.user_type] || '/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4"
            style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}08 0%, ${TURQUOISE}10 100%)` }}>

            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{ border: `1px solid ${TURQUOISE}30` }}>

                    {/* Header Strip */}
                    <div className="p-8 text-center text-white"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                            style={{ background: `${TURQUOISE}25`, border: `2px solid ${TURQUOISE}50` }}>
                            🔑
                        </div>
                        <h2 className="text-2xl font-black mb-1">مرحباً بعودتك!</h2>
                        <p className="text-white/70 text-sm">سجّل دخولك للوصول إلى لوحة التحكم</p>
                    </div>

                    <div className="p-8">
                        {successMsg && (
                            <div className="mb-5 p-4 rounded-xl text-sm font-bold"
                                style={{ background: `${TURQUOISE}15`, borderRight: `4px solid ${TURQUOISE}`, color: '#006a5e' }}>
                                ✓ {successMsg}
                            </div>
                        )}
                        {error && (
                            <div className="mb-5 p-4 rounded-xl text-sm font-bold bg-red-50"
                                style={{ borderRight: '4px solid #ef4444', color: '#b91c1c' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
                            {/* Hidden honeypot fields */}
                            <div className="overflow-hidden w-0 h-0 absolute opacity-0">
                                <input type="text" name="catch_username" tabIndex="-1" autoComplete="username" />
                                <input type="password" name="catch_password" tabIndex="-1" autoComplete="current-password" />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block font-bold mb-2 text-sm" style={{ color: PRUSSIAN }}>نوع الحساب</label>
                                <select name="role" value={formData.role} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border outline-none transition font-medium bg-gray-50"
                                    style={{ borderColor: `${PRUSSIAN}20` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = `${PRUSSIAN}20`}>
                                    <option>إدارة النظام</option>
                                    <option>رئيس المؤتمر</option>
                                    <option>باحث</option>
                                    <option>محكم</option>
                                    <option>اللجنة العلمية</option>
                                    <option>محرر</option>
                                    <option>مكتب التحرير</option>
                                </select>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block font-bold mb-2 text-sm" style={{ color: PRUSSIAN }}>اسم المستخدم أو البريد</label>
                                <input type="text" name="login" value={formData.login} onChange={handleChange}
                                    required autoComplete="new-login"
                                    className="w-full px-4 py-3 rounded-xl border outline-none transition bg-gray-50"
                                    style={{ borderColor: `${PRUSSIAN}20` }}
                                    placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = `${PRUSSIAN}20`} />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block font-bold text-sm" style={{ color: PRUSSIAN }}>كلمة المرور</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: OCEAN }}>
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'} name="password" value={formData.password}
                                        onChange={handleChange} autoComplete="new-password"
                                        className="w-full px-4 py-3 rounded-xl border outline-none transition bg-gray-50 pl-12"
                                        style={{ borderColor: `${PRUSSIAN}20` }}
                                        placeholder="••••••••"
                                        onFocus={e => e.target.style.borderColor = TURQUOISE}
                                        onBlur={e => e.target.style.borderColor = `${PRUSSIAN}20`} />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                className="w-full py-4 rounded-xl text-white font-black text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
                                style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        جاري التحقق...
                                    </span>
                                ) : 'تسجيل الدخول →'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="font-black hover:underline" style={{ color: PRUSSIAN }}>
                                إنشاء حساب جديد
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
