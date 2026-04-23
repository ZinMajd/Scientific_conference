import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

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

        const roleMap = {
            'إدارة النظام': 'admin', 'رئيس المؤتمر': 'chair',
            'باحث': 'author', 'محكم': 'reviewer',
            'اللجنة العلمية': 'committee', 'محرر': 'editor', 'مكتب التحرير': 'office'
        };

        try {
            await axios.post('/api/register', {
                ...formData,
                user_type: roleMap[formData.role]
            });

            navigate('/login', { 
                state: { 
                    message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول باستخدام بياناتك',
                    username: formData.username
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}08 0%, ${TURQUOISE}10 100%)` }}>
            
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                style={{ border: `1px solid ${TURQUOISE}30` }}>
                
                {/* Header Strip */}
                <div className="p-10 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                        style={{ background: `${TURQUOISE}25`, border: `2px solid ${TURQUOISE}50` }}>
                        ✨
                    </div>
                    <h1 className="text-3xl font-black mb-2">إنشاء حساب جديد</h1>
                    <p className="text-white/70 text-sm font-medium">انضم إلى مجتمع جامعة إقليم سبأ العلمي</p>
                </div>

                <div className="p-10">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl text-sm font-bold bg-red-50"
                            style={{ borderRight: '4px solid #ef4444', color: '#b91c1c' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        {/* Hidden Honeypot */}
                        <div className="overflow-hidden w-0 h-0 absolute opacity-0">
                            <input type="text" name="catch_username" tabIndex="-1" autoComplete="username" />
                            <input type="password" name="catch_password" tabIndex="-1" autoComplete="current-password" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>الاسم الكامل</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                style={{ border: `1px solid ${PRUSSIAN}15` }}
                                onFocus={e => e.target.style.borderColor = TURQUOISE}
                                onBlur={e => e.target.style.borderColor = 'transparent'}
                                placeholder="أدخل اسمك الكامل" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>اسم المستخدم</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} required
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}
                                    placeholder="Username" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>البريد الإلكتروني</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}
                                    placeholder="example@mail.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>كلمة المرور</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}
                                    placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>نوع الحساب</label>
                                <select name="role" value={formData.role} onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-bold text-gray-700"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}>
                                    <option>باحث</option>
                                    <option>محكم</option>
                                    <option>اللجنة العلمية</option>
                                    <option>رئيس المؤتمر</option>
                                    <option>محرر</option>
                                    <option>مكتب التحرير</option>
                                    <option>إدارة النظام</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>الجهة / الجامعة</label>
                                <input type="text" name="affiliation" value={formData.affiliation} onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}
                                    placeholder="مثال: جامعة إقليم سبأ" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest mr-1" style={{ color: PRUSSIAN }}>رقم الهاتف</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300 font-medium focus:bg-white"
                                    style={{ border: `1px solid ${PRUSSIAN}15` }}
                                    onFocus={e => e.target.style.borderColor = TURQUOISE}
                                    onBlur={e => e.target.style.borderColor = 'transparent'}
                                    placeholder="00967..." />
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-4 rounded-2xl text-white font-black text-xl shadow-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-70 mt-4"
                            style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                            {loading ? 'جاري المعالجة...' : 'إنشاء الحساب الآن ←'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 font-medium">
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
