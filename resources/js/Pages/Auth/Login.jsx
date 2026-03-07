import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        role: 'باحث'
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
            if (location.state.username) {
                setFormData(prev => ({ ...prev, login: location.state.username }));
            }
            // Clear state to prevent showing on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        try {
            const response = await axios.post('/api/login', {
                login: formData.login,
                password: formData.password
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Check for redirect parameter
            const searchParams = new URLSearchParams(location.search);
            const redirectTo = searchParams.get('redirect');
            
            if (redirectTo) {
                navigate(redirectTo);
                return;
            }

            // توجيه المستخدم تلقائياً إلى لوحة التحكم الخاصة به بناءً على نوع الحساب
            switch(user.user_type) {
                case 'author':
                    // الباحث - يتم توجيهه إلى لوحة تحكم الباحث
                    navigate('/researcher');
                    break;
                case 'reviewer':
                    // المحكم - يتم توجيهه إلى لوحة تحكم المحكم
                    navigate('/reviewer');
                    break;
                case 'chair':
                case 'committee':
                    // رئيس المؤتمر أو اللجنة العلمية - يتم توجيههم إلى لوحة تحكم اللجنة
                    navigate('/committee');
                    break;
                case 'editor':
                case 'office':
                    // المحرر أو مكتب التحرير - يتم توجيههم إلى لوحة تحكم اللجنة
                    navigate('/committee');
                    break;
                case 'admin':
                    // إدارة النظام - يتم توجيههم إلى لوحة تحكم اللجنة (أعلى صلاحيات)
                    navigate('/committee');
                    break;
                default:
                    // في حالة عدم تحديد نوع واضح، يتم التوجيه إلى الملف الشخصي
                    navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Cairo']">مرحباً بعودتك!</h2>
                    <p className="text-gray-500 font-medium">قم بتسجيل الدخول للمتابعة إلى حسابك</p>
                </div>

                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 font-bold rounded-xl animate-in fade-in duration-500">
                        {successMsg}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-xl animate-in shake duration-300">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
                    {/* حقول مخفية لالتقاط الملء التلقائي من المتصفح ومنعه من ملء الحقول الحقيقية */}
                    <div className="overflow-hidden w-0 h-0 absolute opacity-0">
                        <input type="text" name="catch_username" tabIndex="-1" autoComplete="username" />
                        <input type="password" name="catch_password" tabIndex="-1" autoComplete="current-password" />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">نوع الحساب</label>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition bg-gray-50 focus:bg-white font-bold text-gray-700"
                        >
                            <option value="إدارة النظام">إدارة النظام</option>
                            <option value="رئيس المؤتمر">رئيس المؤتمر</option>
                            <option value="باحث">باحث</option>
                            <option value="محكم">محكم</option>
                            <option value="اللجنة العلمية">اللجنة العلمية</option>
                            <option value="محرر">محرر</option>
                            <option value="مكتب التحرير">مكتب التحرير</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">اسم المستخدم أو البريد</label>
                        <input 
                            type="text" 
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            required
                            autoComplete="new-login"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition bg-gray-50 focus:bg-white font-medium"
                            placeholder="اسم المستخدم أو البريد الإلكتروني"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-gray-700 font-medium">كلمة المرور</label>
                             <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">نسيت كلمة المرور؟</Link>
                        </div>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-gray-50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="w-full py-4 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-950/30 transition">
                        تسجيل الدخول
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-600">
                    ليس لديك حساب؟ <Link to="/register" className="text-blue-600 font-bold hover:underline">انشاء حساب جديد</Link>
                </div>
            </div>
        </div>
    );
}
