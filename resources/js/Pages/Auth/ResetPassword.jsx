import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        token: searchParams.get('token') || '',
        email: searchParams.get('email') || '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('/api/reset-password', formData);
            setSuccess(res.data.message || 'تم إعادة تعيين كلمة المرور بنجاح!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ. الرابط قد يكون منتهي الصلاحية.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-12">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 text-blue-600">🔒</div>
                    <h1 className="text-3xl font-black text-blue-950 mb-3 font-['Cairo']">إعادة تعيين كلمة المرور</h1>
                    <p className="text-gray-400 font-medium">أدخل كلمة المرور الجديدة لحسابك</p>
                </div>

                {success && (
                    <div className="mb-6 p-5 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 font-bold rounded-2xl">
                        {success}
                        <p className="text-sm mt-1 font-medium">سيتم تحويلك لصفحة تسجيل الدخول خلال ثوانٍ...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-5 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-2xl">
                        {error}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email (readonly) */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required minLength={8}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                placeholder="8 أحرف على الأقل"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                placeholder="أعد كتابة كلمة المرور"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-blue-950 text-white font-bold rounded-[1.25rem] shadow-xl hover:bg-blue-900 transition flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>{loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}</span>
                        </button>
                    </form>
                )}

                <div className="mt-10 text-center text-gray-400 font-medium">
                    <Link to="/login" className="text-blue-600 font-black hover:underline">العودة لتسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
}
