import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function RegisterReviewer() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        password: '',
        password_confirmation: '',
        expertise: ''
    });

    useEffect(() => {
        if (!token) {
            setError('رمز الدعوة مفقود.');
            setLoading(false);
            return;
        }

        axios.get(`/api/invitation/verify?token=${token}`)
            .then(res => {
                setInvitation(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'الرابط غير صالح.');
                setLoading(false);
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/invitation/complete', {
                token,
                ...form
            });
            alert('تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'فشل إكمال التسجيل.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo']">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo'] p-4 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-red-100">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-black text-red-600 mb-2">عذراً، الرابط غير صالح</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/" className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl">العودة للرئيسية</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo'] py-12 px-4">
            <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-indigo-900 p-10 text-center text-white relative">
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">🏛️</div>
                        <h1 className="text-2xl font-black mb-2">إكمال تسجيل المحكم الخارجي</h1>
                        <p className="text-indigo-100/70 text-sm">أهلاً بك يا دكتور. يسعدنا انضمامك للجنة التحكيم العلمية.</p>
                    </div>
                </div>

                <div className="p-10 space-y-8">
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-400 font-black uppercase mb-1">البيانات المعتمدة</p>
                        <h3 className="text-xl font-black text-indigo-950">{invitation.name}</h3>
                        <p className="text-indigo-600 font-medium">{invitation.email}</p>
                        <p className="text-gray-400 text-sm mt-2">🏢 {invitation.affiliation || 'جهة خارجية'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="password" title="password" className="text-sm font-black text-gray-700">كلمة المرور</label>
                                <input 
                                    id="password"
                                    type="password" 
                                    required
                                    autoComplete="new-password"
                                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-indigo-600"
                                    value={form.password}
                                    onChange={e => setForm({...form, password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="text-sm font-black text-gray-700">تأكيد كلمة المرور</label>
                                <input 
                                    id="password_confirmation"
                                    type="password" 
                                    required
                                    autoComplete="new-password"
                                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-indigo-600"
                                    value={form.password_confirmation}
                                    onChange={e => setForm({...form, password_confirmation: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="expertise" className="text-sm font-black text-gray-700">مجالات الخبرة (اختياري)</label>
                            <textarea 
                                id="expertise"
                                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-indigo-600 h-24"
                                placeholder="مثال: الذكاء الاصطناعي، الأمن السيبراني..."
                                value={form.expertise}
                                onChange={e => setForm({...form, expertise: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full py-5 bg-indigo-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-800 transition disabled:opacity-50"
                        >
                            {submitting ? 'جاري الحفظ...' : 'إكمال عملية التسجيل'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
