import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommitteeReviewers() {
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReviewer, setNewReviewer] = useState({ full_name: '', email: '', affiliation: '' });
    const [errors, setErrors] = useState({});
    const [editingReviewerId, setEditingReviewerId] = useState(null);
    const [viewReviewer, setViewReviewer] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const fetchReviewers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/committee/reviewers');
            setReviewers(response.data);
        } catch (error) {
            console.error('Error fetching reviewers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewers();
    }, []);

    const handleEdit = (reviewer) => {
        setNewReviewer({
            full_name: reviewer.full_name,
            email: reviewer.email,
            affiliation: reviewer.affiliation || ''
        });
        setEditingReviewerId(reviewer.id);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا المحكم؟')) return;
        try {
            await axios.delete(`/api/committee/reviewers/${id}`);
            alert('تم حذف المحكم بنجاح');
            fetchReviewers();
        } catch (error) {
            alert('فشل حذف المحكم: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSaveReviewer = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (editingReviewerId) {
                await axios.put(`/api/committee/reviewers/${editingReviewerId}`, newReviewer);
                alert('تم تعديل بيانات المحكم بنجاح');
            } else {
                await axios.post('/api/committee/reviewers', newReviewer);
                alert('تم إضافة المحكم بنجاح');
            }
            setShowAddModal(false);
            setNewReviewer({ full_name: '', email: '', affiliation: '' });
            setEditingReviewerId(null);
            fetchReviewers();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('فشل حفظ البيانات: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: '', email: '', affiliation: '' });
    const [invitationLink, setInvitationLink] = useState(null);

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/committee/reviewers/invite', inviteForm);
            setInvitationLink(response.data.invitation_link);
            alert('تم إنشاء دعوة التسجيل بنجاح.');
            setInviteForm({ name: '', email: '', affiliation: '' });
        } catch (error) {
            alert('فشل إرسال الدعوة: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">إدارة المحكمين</h1>
                    <p className="text-gray-500 font-medium">إدارة خبراء التحكيم العلمي وتوزيع المهام بدقة</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingReviewerId(null);
                        setNewReviewer({ full_name: '', email: '', affiliation: '' });
                        setShowAddModal(true);
                    }}
                    className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition flex items-center gap-3"
                >
                    <span>➕</span> إضافة محكم جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl">👨‍🏫</div>
                    <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">إجمالي المحكمين</p>
                        <h4 className="text-3xl font-black text-emerald-950 mt-1">{reviewers.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl">⚖️</div>
                    <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">أبحاث قيد التحكيم</p>
                        <h4 className="text-3xl font-black text-emerald-950 mt-1">-</h4>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl">⭐</div>
                    <div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">متوسط جودة التحكيم</p>
                        <h4 className="text-3xl font-black text-emerald-950 mt-1">-</h4>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <th className="px-10 py-6">المحكم</th>
                            <th className="px-10 py-6">الجهة / التخصص</th>
                            <th className="px-10 py-6 text-center">البريد الإلكتروني</th>
                            <th className="px-10 py-6 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-10">جاري التحميل...</td></tr>
                        ) : reviewers.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-10">لا يوجد محكمين</td></tr>
                        ) : reviewers.map(reviewer => (
                            <tr key={reviewer.id} className="hover:bg-emerald-50/10 transition duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black">{reviewer.full_name?.charAt(0)}</div>
                                        <span className="font-bold text-gray-800">{reviewer.full_name}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-gray-500 text-sm">{reviewer.affiliation || 'غير محدد'}</td>
                                <td className="px-10 py-8 text-center text-sm font-black text-gray-400">
                                    {reviewer.email}
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => { setViewReviewer(reviewer); setShowViewModal(true); }} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="عرض الملف">👤</button>
                                        <button onClick={() => handleEdit(reviewer)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="تعديل">📝</button>
                                        <button onClick={() => handleDelete(reviewer.id)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition" title="حذف">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-12 bg-white rounded-[4rem] border border-gray-100 flex items-center gap-12 group">
                <div className="w-32 h-32 bg-emerald-100 rounded-[3rem] shrink-0 rotate-3 group-hover:rotate-0 transition-transform flex items-center justify-center text-5xl">📫</div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-emerald-900">دعوات محكمين خارجيين</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">أرسل دعوات تسجيل رسمية لأساتذة من خارج الجامعة للمشاركة في تحكيم المؤتمر الحالي بمميزات خاصة وتحصيل التراخيص اللازمة.</p>
                    <button 
                        onClick={() => {
                            setInvitationLink(null);
                            setShowInviteModal(true);
                        }}
                        className="px-10 py-4 bg-emerald-950 text-white font-black rounded-3xl hover:bg-emerald-800 transition shadow-xl shadow-emerald-950/20"
                    >
                        إرسال دعوات التسجيل ➔
                    </button>
                </div>
            </div>

            {/* Invitation Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-emerald-950">إرسال دعوة لمحكم خارجي</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        {invitationLink ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                    <p className="text-emerald-800 font-bold mb-4">تم إنشاء الرابط بنجاح! انسخ الرابط وأرسله للمحكم:</p>
                                    <div className="p-4 bg-white border border-emerald-200 rounded-xl font-mono text-xs break-all select-all">
                                        {invitationLink}
                                    </div>
                                </div>
                                <button onClick={() => setInvitationLink(null)} className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition">إرسال دعوة أخرى</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSendInvitation} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم الأستاذ / المحكم</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={inviteForm.name}
                                        onChange={e => setInviteForm({...inviteForm, name: e.target.value})}
                                        placeholder="مثال: د. أحمد محمد"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({...inviteForm, email: e.target.value})}
                                        placeholder="professor@university.edu"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الجامعة / الجهة الخارجية</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={inviteForm.affiliation}
                                        onChange={e => setInviteForm({...inviteForm, affiliation: e.target.value})}
                                        placeholder="جامعة"
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="flex-1 bg-emerald-950 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition">إنشاء رابط الدعوة</button>
                                    <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Add Reviewer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">{editingReviewerId ? 'تعديل بيانات المحكم' : 'إضافة محكم جديد'}</h3>
                        <form onSubmit={handleSaveReviewer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    className={`w-full p-3 rounded-xl border ${errors.full_name ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                    value={newReviewer.full_name}
                                    onChange={e => setNewReviewer({...newReviewer, full_name: e.target.value})}
                                    required
                                />
                                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                                <input 
                                    type="email" 
                                    className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                    value={newReviewer.email}
                                    onChange={e => setNewReviewer({...newReviewer, email: e.target.value})}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الجهة / التخصص</label>
                                <input 
                                    type="text" 
                                    className={`w-full p-3 rounded-xl border ${errors.affiliation ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 outline-none`}
                                    value={newReviewer.affiliation}
                                    onChange={e => setNewReviewer({...newReviewer, affiliation: e.target.value})}
                                />
                                {errors.affiliation && <p className="text-red-500 text-xs mt-1">{errors.affiliation[0]}</p>}
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">{editingReviewerId ? 'حفظ التعديلات' : 'إضافة'}</button>
                                <button type="button" onClick={() => { setShowAddModal(false); setEditingReviewerId(null); setNewReviewer({ full_name: '', email: '', affiliation: '' }); }} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Reviewer Modal */}
            {showViewModal && viewReviewer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-black text-emerald-950">بيانات المحكم</h3>
                            <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-red-500 transition">✕</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl font-black text-emerald-600 mb-4">
                                    {viewReviewer.full_name?.charAt(0)}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{viewReviewer.full_name}</h4>
                                <p className="text-emerald-600 font-medium">{viewReviewer.user_type === 'reviewer' ? 'محكم علمي' : viewReviewer.user_type}</p>
                            </div>

                            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📧</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">البريد الإلكتروني</p>
                                        <p className="font-mono text-gray-700">{viewReviewer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🏢</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">الجهة / التخصص</p>
                                        <p className="font-bold text-gray-700">{viewReviewer.affiliation || 'غير محدد'}</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setShowViewModal(false)} className="w-full py-4 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
