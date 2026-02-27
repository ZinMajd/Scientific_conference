import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // In real app, call your password reset API
            // await axios.post('/api/forgot-password', { email });
            setSuccess('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح!');
        } catch (err) {
            setError('فشل إرسال الرابط. تأكد من صحة البريد الإلكتروني.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-12">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 text-blue-600">🗝️</div>
                    <h1 className="text-3xl font-black text-blue-950 mb-3 font-['Cairo']">استعادة كلمة المرور</h1>
                    <p className="text-gray-400 font-medium">أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور</p>
                </div>

                {success && (
                    <div className="mb-6 p-5 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 font-bold rounded-2xl animate-in fade-in duration-500">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-5 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-2xl animate-in shake duration-300">
                        {error}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <input 
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full py-5 bg-blue-950 text-white font-bold rounded-[1.25rem] shadow-xl hover:bg-blue-900 transition flex items-center justify-center gap-3"
                        >
                            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>إرسال الرابط</span>
                        </button>
                    </form>
                )}

                <div className="mt-10 text-center text-gray-400 font-medium">
                    تذكرت كلمة المرور؟ <Link to="/login" className="text-blue-600 font-black hover:underline">تسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
}
