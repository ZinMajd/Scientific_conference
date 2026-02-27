import React, { useState } from 'react';
import axios from 'axios';

export default function Security() {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setError('كلمات المرور الجديدة غير متطابقة.');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/profile/change-password', passwords);
            setSuccess('تم مغير كلمة المرور بنجاح!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'فشل تغيير كلمة المرور.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 bg-indigo-950 text-white flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔒</div>
                    <div>
                        <h1 className="text-xl font-black">أمان الحساب</h1>
                        <p className="text-indigo-200 text-xs mt-1">قم بتحديث كلمة المرور لحماية حسابك</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    {success && <div className="p-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100 flex items-center gap-3">✅ {success}</div>}
                    {error && <div className="p-4 bg-red-50 text-red-700 font-bold rounded-xl border border-red-100 flex items-center gap-3">⚠️ {error}</div>}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-indigo-950 uppercase tracking-widest mr-2">كلمة المرور الحالية</label>
                        <input 
                            type="password" name="current" value={passwords.current} onChange={handleChange} required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-indigo-950 uppercase tracking-widest mr-2">كلمة المرور الجديدة</label>
                        <input 
                            type="password" name="new" value={passwords.new} onChange={handleChange} required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-indigo-950 uppercase tracking-widest mr-2">تأكيد كلمة المرور الجديدة</label>
                        <input 
                            type="password" name="confirm" value={passwords.confirm} onChange={handleChange} required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-4 bg-indigo-900 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-800 transition flex items-center justify-center gap-3"
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                        <span>تحديث كلمة المرور</span>
                    </button>
                </form>
            </div>

            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
                <span className="text-2xl">💡</span>
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                    يُنصح باستخدام كلمة مرور قوية تحتوي على حروف وأرقام ورموز لضمان أقصى حماية لبياناتك البحثية ومراسلاتك الأكاديمية.
                </p>
            </div>
        </div>
    );
}
