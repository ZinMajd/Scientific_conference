import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        role: '',
        affiliation: '',
        phone: '',
        address: '',
        bio: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const roleMap = {
            'إدارة النظام': 'admin',
            'رئيس المؤتمر': 'chair',
            'باحث': 'author',
            'محكم': 'reviewer',
            'اللجنة العلمية': 'committee',
            'محرر': 'editor',
            'مكتب التحرير': 'office'
        };

        try {
            const response = await axios.post('/api/register', {
                full_name: formData.full_name,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                user_type: roleMap[formData.role],
                affiliation: formData.affiliation,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio
            });

            const { user } = response.data;
            // Instead of auto-login, redirect to login page with a success message
            navigate('/login', { 
                state: { 
                    message: '.تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول باستخدام بياناتك',
                    username: formData.username
                } 
            });
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors).flat()[0];
                setError(firstError || 'بيانات المدخلات غير صالحة');
            } else {
                setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل. تأكد من صحة البيانات.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-blue-950 mb-3 font-['Cairo'] tracking-tight">إنشاء حساب جديد</h1>
                    <p className="text-gray-400 font-medium">انضم إلى مجتمع جامعة إقليم سبأ العلمي</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-xl animate-in shake duration-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">الاسم الكامل</label>
                        <input 
                            type="text" 
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                            placeholder="الاسم الكامل"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">اسم المستخدم</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="اسم المستخدم"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="البريد الإلكتروني"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">كلمة المرور</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="كلمة المرور"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">نوع الحساب</label>
                            <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-bold text-gray-700 appearance-none"
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">الجهة / الجامعة</label>
                            <input 
                                type="text" 
                                name="affiliation"
                                value={formData.affiliation}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="الجهة / الجامعة"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">رقم الهاتف</label>
                            <input 
                                type="text" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="رقم الهاتف"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">العنوان</label>
                        <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                            placeholder="العنوان"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">نبذة مختصرة</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                            placeholder="نبذة مختصرة"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-blue-950 text-white rounded-3xl font-black text-lg shadow-2xl shadow-blue-900/20 hover:bg-blue-900 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-400 font-medium">لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 font-black hover:underline underline-offset-4">سجل دخولك هنا</Link></p>
                </div>
            </div>
        </div>
    );
}
