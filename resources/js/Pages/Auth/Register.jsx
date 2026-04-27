import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

const ROLE_MAP = {
    'إدارة النظام': 'admin', 'رئيس المؤتمر': 'chair',
    'باحث': 'author', 'محكم': 'reviewer',
    'اللجنة العلمية': 'committee', 'محرر': 'editor', 'مكتب التحرير': 'office',
    'مكتب الإنتاج والنشر': 'production_office'
};


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '', email: '', username: '', password: '',
        role: 'باحث', affiliation: '', phone: '', address: '', bio: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/register', {
                ...formData,
                user_type: ROLE_MAP[formData.role]
            });

            navigate('/login', { 
                state: { 
                    message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول باستخدام بياناتك'
                } 
            });

        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                setError(Object.values(validationErrors).flat()[0] || 'بيانات المدخلات غير صالحة');
            } else {
                setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4"
            style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}08 0%, ${TURQUOISE}10 100%)` }}>
            
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                style={{ border: `1px solid ${TURQUOISE}30` }}>
                
                {/* Header Strip */}
                <div className="p-8 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                    <h1 className="text-3xl font-black mb-2 font-['Cairo']">إنشاء حساب جديد</h1>
                    <p className="text-white/70 text-sm font-bold">انضم إلى مجتمع جامعة إقليم سبأ العلمي</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-8 p-5 rounded-2xl text-sm font-bold bg-rose-50 border-r-4 border-rose-500 text-rose-700 animate-shake">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" autoComplete="off">
                        {/* Hidden Honeypot */}
                        <div className="hidden">
                            <input type="text" name="hp_user" tabIndex="-1" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="full_name" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>الاسم الكامل</label>
                            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="أدخل اسمك الكامل" autoComplete="name" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="username" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>اسم المستخدم</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="Username" autoComplete="username" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>البريد الإلكتروني</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="example@mail.com" autoComplete="email" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>كلمة المرور</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="••••••••" autoComplete="new-password" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>نوع الحساب</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-black text-gray-700"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}>
                                <option value="باحث">باحث</option>
                                <option value="محكم">محكم</option>
                                <option value="مكتب التحرير">مكتب التحرير</option>
                                <option value="محرر">محرر</option>
                                <option value="رئيس المؤتمر">رئيس المؤتمر</option>
                                <option value="اللجنة العلمية">اللجنة العلمية</option>
                                <option value="مكتب الإنتاج والنشر">مكتب الإنتاج والنشر</option>
                                <option value="إدارة النظام">إدارة النظام</option>

                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="affiliation" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>الجهة / الجامعة</label>
                            <input type="text" id="affiliation" name="affiliation" value={formData.affiliation} onChange={handleChange}
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="مثال: جامعة إقليم سبأ" autoComplete="organization" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>رقم الهاتف</label>
                            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                                className="w-full px-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="00967..." autoComplete="tel" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="bio" className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>نبذة تعريفية</label>
                            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="2"
                                className="w-full px-6 py-3 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold focus:bg-white resize-none"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                placeholder="اكتب نبذة عن تخصصك..." />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" disabled={loading}
                                className="w-full py-5 rounded-3xl text-white font-black text-xl shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
                                style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                                {loading ? 'جاري المعالجة...' : 'تأكيد إنشاء الحساب ←'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 font-bold">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="font-black hover:underline" style={{ color: OCEAN }}>
                                سجل دخولك هنا
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
