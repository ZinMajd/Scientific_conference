import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const GOLD = '#D4AF37';
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
        <div className="min-h-screen flex flex-col lg:flex-row" 
             style={{ 
                 direction: 'rtl',
                 fontFamily: "'Almarai', sans-serif",
                 backgroundColor: '#f8fafc'
             }}>
            
            {/* الجهة اليمنى: صورة الرئيسية */}
            <div className="hidden lg:block lg:w-[52%] relative bg-[#001a2e]">
                <img src="/images/hero_conference.png" alt="University Conference" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-[#001a2e]/70"></div>
                <div className="absolute inset-0 bg-[#0096c7] mix-blend-multiply opacity-20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-8">
                    <h2 className="text-5xl font-bold mb-4 font-['Cairo'] leading-tight drop-shadow-lg text-center">بوابة البحث العلمي والمؤتمرات</h2>
                    <p className="text-2xl text-teal-400 font-semibold drop-shadow-md text-center">جامعة إقليم سبأ</p>
                </div>
            </div>

            {/* الجهة اليسرى: نافذة إنشاء حساب */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center items-center relative overflow-y-auto bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20 min-h-screen py-10 px-8">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: OCEAN }}></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: GOLD }}></div>

                <div className="w-full max-w-[620px] mx-auto animate-fade-in relative z-10 flex flex-col justify-center my-auto space-y-6">
                    
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-black mb-1 font-['Cairo'] tracking-wide animate-slide-down" style={{ color: PRUSSIAN_DARK }}>إنشاء حساب جديد</h1>
                        <p className="text-sm font-bold text-slate-400">انضم إلى مجتمع جامعة إقليم سبأ العلمي</p>
                    </div>

                    <div className="w-full">
                        {error && (
                            <div className="mb-6 p-4 rounded-full text-sm font-bold bg-rose-50 border border-rose-200 text-rose-700 animate-shake text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" autoComplete="off">
                            {/* Hidden Honeypot */}
                            <div className="hidden">
                                <input type="text" name="hp_user" tabIndex="-1" />
                            </div>

                            {/* Full Name */}
                            <div className="space-y-1 md:col-span-2">
                                <label htmlFor="full_name" className="block text-xs font-bold text-slate-500 mr-2">الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    id="full_name" 
                                    name="full_name" 
                                    value={formData.full_name} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="أدخل اسمك الكامل ثلاثياً" 
                                    autoComplete="name" 
                                />
                            </div>

                            {/* Username */}
                            <div className="space-y-1">
                                <label htmlFor="username" className="block text-xs font-bold text-slate-500 mr-2">اسم المستخدم</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="Username" 
                                    autoComplete="username" 
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-bold text-slate-500 mr-2">البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="example@mail.com" 
                                    autoComplete="email" 
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-500 mr-2">كلمة المرور</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="••••••••" 
                                    autoComplete="new-password" 
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-1">
                                <label htmlFor="role" className="block text-xs font-bold text-slate-500 mr-2">نوع الحساب</label>
                                <select 
                                    id="role" 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-bold text-slate-700 focus:border-sky-500 text-center cursor-pointer"
                                >
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

                            {/* Affiliation */}
                            <div className="space-y-1">
                                <label htmlFor="affiliation" className="block text-xs font-bold text-slate-500 mr-2">الجهة / الجامعة</label>
                                <input 
                                    type="text" 
                                    id="affiliation" 
                                    name="affiliation" 
                                    value={formData.affiliation} 
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="مثال: جامعة إقليم سبأ" 
                                    autoComplete="organization" 
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label htmlFor="phone" className="block text-xs font-bold text-slate-500 mr-2">رقم الهاتف</label>
                                <input 
                                    type="text" 
                                    id="phone" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center"
                                    placeholder="00967..." 
                                    autoComplete="tel" 
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* Bio */}
                            <div className="space-y-1 md:col-span-2">
                                <label htmlFor="bio" className="block text-xs font-bold text-slate-500 mr-2">نبذة تعريفية</label>
                                <textarea 
                                    id="bio" 
                                    name="bio" 
                                    value={formData.bio} 
                                    onChange={handleChange} 
                                    rows="2"
                                    className="w-full px-5 py-4 text-base bg-white border border-slate-200 rounded-none outline-none transition-all duration-300 font-normal focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 text-center resize-none"
                                    placeholder="اكتب تخصصك العلمي أو مجالات اهتمامك..." 
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 md:col-span-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 rounded-none text-white font-black text-base shadow-lg transition-all duration-300 hover:bg-[#001a2e] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                                    style={{ background: PRUSSIAN }}
                                >
                                    {loading ? 'جاري المعالجة...' : 'تأكيد إنشاء الحساب ←'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center">
                        <p className="text-sm text-slate-400 font-bold">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="font-black hover:underline transition-colors" style={{ color: OCEAN }}>
                                سجل دخولك هنا
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
            
        </div>
    );
}
