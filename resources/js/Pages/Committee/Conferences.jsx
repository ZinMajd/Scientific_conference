import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CommitteeConferences() {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingConf, setEditingConf] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        short_name: '',
        description: '',
        venue: '',
        website_url: '',
        contact_email: '',
        start_date: '',
        end_date: '',
        submission_deadline: '',
        review_deadline: '',
        notification_date: '',
        camera_ready_deadline: '',
        registration_deadline: '',
        registration_fee: '',
        max_papers: '',
        status: 'draft'
    });
    const [errors, setErrors] = useState({});

    const fetchConferences = async () => {
        try {
            const response = await axios.get('/api/committee/conferences');
            setConferences(response.data);
        } catch (error) {
            console.error('Error fetching conferences:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConferences();
    }, []);

    const handleCreate = () => {
        setEditingConf(null);
        setFormData({ 
            title: '', 
            short_name: '',
            description: '',
            venue: '',
            website_url: '',
            contact_email: '',
            start_date: '',
            end_date: '',
            submission_deadline: '',
            review_deadline: '',
            notification_date: '',
            camera_ready_deadline: '',
            registration_deadline: '',
            registration_fee: '',
            max_papers: '',
            status: 'draft'
        });
        setErrors({});
        setShowModal(true);
    };

    const handleEdit = (conf) => {
        setEditingConf(conf);
        setFormData({
            title: conf.title,
            short_name: conf.short_name || '',
            description: conf.description || '',
            venue: conf.venue || '',
            website_url: conf.website_url || '',
            contact_email: conf.contact_email || '',
            start_date: conf.start_date?.split('T')[0] || '',
            end_date: conf.end_date?.split('T')[0] || '',
            submission_deadline: conf.submission_deadline?.split('T')[0] || '',
            review_deadline: conf.review_deadline?.split('T')[0] || '',
            notification_date: conf.notification_date?.split('T')[0] || '',
            camera_ready_deadline: conf.camera_ready_deadline?.split('T')[0] || '',
            registration_deadline: conf.registration_deadline?.split('T')[0] || '',
            registration_fee: conf.registration_fee || '',
            max_papers: conf.max_papers || '',
            status: conf.status
        });
        setErrors({});
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (editingConf) {
                await axios.put(`/api/committee/conferences/${editingConf.id}`, formData);
                alert('تم تعديل المؤتمر بنجاح');
            } else {
                await axios.post('/api/committee/conferences', formData);
                alert('تم إنشاء المؤتمر بنجاح');
            }
            setShowModal(false);
            fetchConferences();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('فشل الحفظ: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Same header... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">إدارة المؤتمرات</h1>
                    <p className="text-gray-500 font-medium">التحكم الكامل في المؤتمرات العلمية المعلنة والقادمة</p>
                </div>
                <button onClick={handleCreate} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition flex items-center gap-3">
                    <span>🏛️</span> إنشاء مؤتمر جديد
                </button>
            </div>

            {/* List... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {conferences.map((conf) => (
                    <div key={conf.id} className="bg-white rounded-[3.5rem] shadow-xl border border-gray-100 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        <div className={`h-4 ${conf.status === 'closed' || conf.status === 'archived' ? 'bg-gray-400' : (conf.status === 'open' || conf.status === 'reviewing') ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                        <div className="p-12 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-emerald-950 group-hover:text-emerald-600 transition">{conf.title}</h3>
                                    <p className="text-gray-400 font-bold flex items-center gap-2">📅 {new Date(conf.start_date).toLocaleDateString('ar-SA')}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                    (conf.status === 'closed' || conf.status === 'archived') ? 'bg-gray-100 text-gray-600' :
                                    (conf.status === 'open' || conf.status === 'reviewing') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {conf.status === 'closed' ? 'منتهي' : conf.status === 'archived' ? 'مؤرشف' : (conf.status === 'open' || conf.status === 'reviewing') ? 'نشط ومباشر' : 'مسودة قيد التجهيز'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">الأبحاث</p>
                                    <h4 className="text-2xl font-black text-emerald-950">{conf.papers_count || 0}</h4>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-3xl text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">المؤلفون</p>
                                    <h4 className="text-2xl font-black text-emerald-950">{conf.authors_count || 0}</h4>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => handleEdit(conf)} className="flex-1 py-4 bg-emerald-950 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-900 transition">تعديل الإعدادات</button>
                                <Link to="/committee/reports" className="px-6 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition text-center flex items-center justify-center">التقارير</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 my-10">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">{editingConf ? 'تعديل بيانات المؤتمر' : 'إنشاء مؤتمر جديد'}</h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المؤتمر</label>
                                    <input 
                                        type="text" 
                                        className={`w-full p-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">المكان (Venue)</label>
                                    <input 
                                        type="text" 
                                        className={`w-full p-3 rounded-xl border ${errors.venue ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.venue}
                                        onChange={e => setFormData({...formData, venue: e.target.value})}
                                        required
                                    />
                                    {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue[0]}</p>}
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم مختصر (Short Name)</label>
                                    <input 
                                        type="text" 
                                        className={`w-full p-3 rounded-xl border ${errors.short_name ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.short_name}
                                        onChange={e => setFormData({...formData, short_name: e.target.value})}
                                    />
                                    {errors.short_name && <p className="text-red-500 text-xs mt-1">{errors.short_name[0]}</p>}
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني للتواصل</label>
                                    <input 
                                        type="email" 
                                        className={`w-full p-3 rounded-xl border ${errors.contact_email ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.contact_email}
                                        onChange={e => setFormData({...formData, contact_email: e.target.value})}
                                    />
                                    {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email[0]}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">رابط الموقع (Website URL)</label>
                                    <input 
                                        type="url" 
                                        className={`w-full p-3 rounded-xl border ${errors.website_url ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.website_url}
                                        onChange={e => setFormData({...formData, website_url: e.target.value})}
                                        placeholder="https://example.com"
                                    />
                                    {errors.website_url && <p className="text-red-500 text-xs mt-1">{errors.website_url[0]}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ البدء</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.start_date ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.start_date}
                                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                                        required
                                    />
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الانتهاء</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.end_date ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.end_date}
                                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                                        required
                                    />
                                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">موعد تقديم الأبحاث</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.submission_deadline ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.submission_deadline}
                                        onChange={e => setFormData({...formData, submission_deadline: e.target.value})}
                                        required
                                    />
                                    {errors.submission_deadline && <p className="text-red-500 text-xs mt-1">{errors.submission_deadline[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">موعد التحكيم</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.review_deadline ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.review_deadline}
                                        onChange={e => setFormData({...formData, review_deadline: e.target.value})}
                                        required
                                    />
                                    {errors.review_deadline && <p className="text-red-500 text-xs mt-1">{errors.review_deadline[0]}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">موعد الإشعار</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.notification_date ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.notification_date}
                                        onChange={e => setFormData({...formData, notification_date: e.target.value})}
                                        required
                                    />
                                    {errors.notification_date && <p className="text-red-500 text-xs mt-1">{errors.notification_date[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">موعد النسخة النهائية (Camera Ready)</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.camera_ready_deadline ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.camera_ready_deadline}
                                        onChange={e => setFormData({...formData, camera_ready_deadline: e.target.value})}
                                    />
                                    {errors.camera_ready_deadline && <p className="text-red-500 text-xs mt-1">{errors.camera_ready_deadline[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">موعد انتهاء التسجيل</label>
                                    <input 
                                        type="date" 
                                        className={`w-full p-3 rounded-xl border ${errors.registration_deadline ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.registration_deadline}
                                        onChange={e => setFormData({...formData, registration_deadline: e.target.value})}
                                    />
                                    {errors.registration_deadline && <p className="text-red-500 text-xs mt-1">{errors.registration_deadline[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">رسوم التسجيل</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className={`w-full p-3 rounded-xl border ${errors.registration_fee ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.registration_fee}
                                        onChange={e => setFormData({...formData, registration_fee: e.target.value})}
                                    />
                                    {errors.registration_fee && <p className="text-red-500 text-xs mt-1">{errors.registration_fee[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الحد الأقصى للأوراق</label>
                                    <input 
                                        type="number" 
                                        className={`w-full p-3 rounded-xl border ${errors.max_papers ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                        value={formData.max_papers}
                                        onChange={e => setFormData({...formData, max_papers: e.target.value})}
                                    />
                                    {errors.max_papers && <p className="text-red-500 text-xs mt-1">{errors.max_papers[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                                    <select 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="draft">مسودة</option>
                                        <option value="open">متاح للتسجيل (Open)</option>
                                        <option value="reviewing">قيد التحكيم (Reviewing)</option>
                                        <option value="closed">منتهي (Closed)</option>
                                        <option value="archived">مؤرشف</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                                <textarea 
                                    className={`w-full p-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none h-24`}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                ></textarea>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">حفظ</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white p-12 rounded-[4rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl grayscale">📅</div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-400">نهاية القائمة</h3>
                    <p className="text-gray-300 text-sm font-medium">ابدأ بتخطيط مؤتمرك القادم واستخدم أدواتنا لإدارة كافة التفاصيل</p>
                </div>
            </div>
        </div>
    );
}
