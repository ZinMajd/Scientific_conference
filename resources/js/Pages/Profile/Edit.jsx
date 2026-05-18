import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function ProfileEdit() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(user.profile_image ? `/storage_file/${user.profile_image}` : null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('full_name', user.full_name || '');
        formData.append('email', user.email || '');
        formData.append('affiliation', user.affiliation || '');
        formData.append('phone', user.phone || '');
        formData.append('bio', user.bio || '');
        
        if (selectedFile) {
            formData.append('profile_image', selectedFile);
        }

        try {
            const response = await axios.post('/api/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setSuccess('تم تحديث البيانات بنجاح!');
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء التحديث.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div 
                    className="p-8 text-white flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #0096c7 100%)' }}
                >
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-2xl font-black">تعديل الملف الشخصي</h1>
                            <a href="/researcher" className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition font-bold text-white no-underline">العودة للوحة التحكم ↩</a>
                        </div>
                        <p className="text-blue-200 text-sm mt-1">قم بتحديث معلوماتك الشخصية والأكاديمية، واضغط على صورتك لتغييرها</p>
                    </div>
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl overflow-hidden border-2 border-white/20 group-hover:border-white transition-all shadow-xl">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>👤</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-2xl">📷</span>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            accept="image/*" 
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {success && <div className="p-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl border border-emerald-100">{success}</div>}
                    {error && <div className="p-4 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-100">{error}</div>}

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">الاسم الكامل</label>
                            <input 
                                type="text" name="full_name" value={user.full_name || ''} onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <input 
                                type="email" name="email" value={user.email || ''} onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">المسمى الأكاديمي / الجهة</label>
                            <input 
                                type="text" name="affiliation" value={user.affiliation || ''} onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                placeholder="مثلاً: جامعة إقليم سبأ - كلية الحاسوب"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">رقم الهاتف</label>
                            <input 
                                type="text" name="phone" value={user.phone || ''} onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-blue-950 uppercase tracking-widest mr-2">نبذة مختصة (Bio)</label>
                        <textarea 
                            name="bio" value={user.bio || ''} onChange={handleChange} rows="4"
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            disabled={loading}
                            className="px-12 py-4 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/20"
                            style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #0096c7 100%)' }}
                        >
                            {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            <span>حفظ التغييرات</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
