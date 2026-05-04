import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductionDashboard() {
    const [activeTab, setActiveTab] = useState('production'); // production, archive
    const [papers, setPapers] = useState([]);
    const [archivePapers, setArchivePapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [processForm, setProcessForm] = useState({
        doi: '',
        page_numbers: '',
        publish_delay_days: 2,
        final_file: null,
        thumbnail: null,
        notes: ''
    });

    const fetchPapers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/production/papers');
            setPapers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch production papers', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchArchive = async () => {
        setArchiveLoading(true);
        try {
            const res = await axios.get('/api/archive');
            setArchivePapers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch archive', err);
        } finally {
            setArchiveLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'production') {
            fetchPapers();
        } else {
            fetchArchive();
        }
    }, [activeTab]);

    const getStatusLabel = (status) => {
        const labels = {
            'accepted': { text: 'مقبول نهائياً', color: 'bg-emerald-100 text-emerald-700' },
            'production_revision_required': { text: 'مطلوب تعديل من الباحث', color: 'bg-orange-100 text-orange-700' },
            'in_production': { text: 'قيد التنسيق والإنتاج', color: 'bg-blue-100 text-blue-700' },
            'ready_to_publish': { text: 'جاهز للنشر المجدول', color: 'bg-amber-100 text-amber-700' },
            'scheduled': { text: 'تمت الجدولة (بانتظار الموعد)', color: 'bg-teal-100 text-teal-700' },
            'published': { text: 'منشور نهائياً', color: 'bg-indigo-100 text-indigo-700' }

        };
        return labels[status] || { text: status, color: 'bg-gray-100 text-gray-700' };
    };

    const openProcessModal = (paper) => {
        setSelectedPaper(paper);
        setProcessForm({
            doi: paper.doi || '',
            page_numbers: paper.page_numbers || '',
            publish_delay_days: 2,
            final_file: null,
            thumbnail: null,
            notes: paper.production_notes || ''
        });
        setShowProcessModal(true);
    };

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('doi', processForm.doi);
        formData.append('page_numbers', processForm.page_numbers);
        if (processForm.final_file) {
            formData.append('final_file', processForm.final_file);
        }
        if (processForm.thumbnail) {
            formData.append('thumbnail', processForm.thumbnail);
        }

        try {
            await axios.post(`/api/production/papers/${selectedPaper.id}/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('تم تحديث بيانات البحث بنجاح');
            fetchPapers();
        } catch (err) {
            console.error(err);
            alert('خطأ في التحديث');
        }
    };

    const handleMarkReady = async () => {
        try {
            await axios.post(`/api/production/papers/${selectedPaper.id}/ready`, {
                publish_delay_days: processForm.publish_delay_days
            });
            alert('تم اعتماد البحث وجدولته للنشر');
            setShowProcessModal(false);
            fetchPapers();
        } catch (err) {

            console.error(err);
            alert('خطأ في الجدولة');
        }
    };

    const handlePublishNow = async (paper) => {
        if (!confirm('هل أنت متأكد من رغبتك في نشر البحث الآن فوراً؟')) return;
        try {
            await axios.post(`/api/production/papers/${paper.id}/publish`);
            alert('تم النشر بنجاح');
            fetchPapers();
        } catch (err) {
            console.error(err);
            alert('خطأ في النشر');
        }
    };


    const promptReturnToAuthor = async (paper) => {
        const notes = prompt('ما هي التعديلات المطلوبة من الباحث بخصوص التنسيق؟');
        if (!notes) return;
        try {
            await axios.post(`/api/production/papers/${paper.id}/return`, { notes });
            alert('تم إعادة البحث للباحث لتعديل التنسيق');
            fetchPapers();
        } catch (err) {
            console.error(err);
            alert('خطأ في الإعادة');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">مكتب الإنتاج والنشر العلمي</h1>
                    <p className="text-gray-500 font-medium italic mt-1">تنسيق، مراجعة، وجدولة نشر الأبحاث المقبولة</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setActiveTab('production')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition ${activeTab === 'production' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600'}`}
                    >
                        الأبحاث قيد الإنتاج
                    </button>
                    <button 
                        onClick={() => setActiveTab('archive')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition ${activeTab === 'archive' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600'}`}
                    >
                        الأرشيف العلمي
                    </button>
                </div>
            </div>

            {activeTab === 'production' ? (
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    {/* ... (Existing Table) ... */}
                    <table className="w-full text-right border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">البحث والمؤلف</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">تاريخ النشر المجدول</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-400">جاري التحميل...</td></tr>
                            ) : papers.length === 0 ? (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-bold">لا توجد أبحاث في مرحلة الإنتاج حالياً</td></tr>
                            ) : papers.map(paper => (
                                <tr key={paper.id} className="hover:bg-indigo-50/10 transition">
                                    <td className="px-8 py-6">
                                        <h5 className="font-black text-indigo-950">{paper.title}</h5>
                                        <p className="text-xs text-gray-400 font-bold mt-1">{paper.author?.full_name} | {paper.conference?.title}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${getStatusLabel(paper.status).color}`}>
                                            {getStatusLabel(paper.status).text}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-bold">
                                        {paper.publish_at ? new Date(paper.publish_at).toLocaleDateString('ar-EG') : 'غير مجدول'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center gap-2">
                                            <a href={`/storage_file/${paper.final_file_path || paper.file_path}`} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-gray-200 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm" title="مراجعة البحث (فتح PDF)">📄</a>
                                            <button onClick={() => openProcessModal(paper)} className="p-2.5 bg-white border border-gray-200 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm" title="تنسيق وجدولة النشر">⚙️</button>
                                            <button onClick={() => promptReturnToAuthor(paper)} className="p-2.5 bg-white border border-gray-200 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm" title="إعادة للباحث لتعديل التنسيق">↩️</button>
                                            <button onClick={() => handlePublishNow(paper)} className="p-2.5 bg-white border border-gray-200 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition shadow-sm" title="تنفيذ النشر فوراً">🚀</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archiveLoading ? (
                            <div className="col-span-3 py-20 text-center text-gray-400">جاري تحميل الأرشيف...</div>
                        ) : archivePapers.length === 0 ? (
                            <div className="col-span-3 py-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-200">لا توجد أبحاث منشورة في الأرشيف حالياً</div>
                        ) : archivePapers.map(paper => (
                            <div key={paper.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black">✔ منشور نهائياً</span>
                                    <span className="text-[10px] text-gray-400">#{paper.id}</span>
                                </div>
                                <h4 className="font-black text-indigo-950 mb-4 line-clamp-2">{paper.title}</h4>
                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">👤</div>
                                        <span className="text-xs font-bold text-gray-600">{paper.author?.full_name}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>DOI: {paper.doi || 'N/A'}</span>
                                        <span>الصفحات: {paper.page_numbers || 'N/A'}</span>
                                    </div>
                                    <a 
                                        href={`/storage_file/${paper.final_file_path || paper.file_path}`} 
                                        target="_blank"
                                        className="w-full py-3 bg-gray-50 text-indigo-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition"
                                    >
                                        📥 تحميل النسخة النهائية
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Processing Modal */}
            {showProcessModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-indigo-950 font-['Cairo']">تجهيز البحث للنشر النهائي</h3>
                                <p className="text-gray-500 font-bold text-sm mt-1">{selectedPaper?.title}</p>
                            </div>
                            <button onClick={() => setShowProcessModal(false)} className="text-gray-400 hover:text-red-500 transition text-2xl">✕</button>
                        </div>

                        <form onSubmit={handleUpdateDetails} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-black text-indigo-950 mb-2">معرف الكائن الرقمي (DOI)</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition font-bold text-sm"
                                        placeholder="مثال: 10.1234/conf.2026.001"
                                        value={processForm.doi}
                                        onChange={e => setProcessForm({...processForm, doi: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-indigo-950 mb-2">أرقام الصفحات</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-indigo-500 transition font-bold text-sm"
                                        placeholder="مثال: 120-135"
                                        value={processForm.page_numbers}
                                        onChange={e => setProcessForm({...processForm, page_numbers: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 border-2 border-dashed border-indigo-100 rounded-3xl bg-indigo-50/30 flex flex-col items-center gap-4 group hover:border-indigo-300 transition">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-3xl group-hover:scale-110 transition">📄</div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-indigo-900">رفع النسخة النهائية (PDF)</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Camera-Ready Manuscript</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept=".pdf"
                                        className="hidden" 
                                        id="final-file-upload"
                                        onChange={e => setProcessForm({...processForm, final_file: e.target.files[0]})}
                                    />
                                    <label htmlFor="final-file-upload" className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black cursor-pointer hover:bg-indigo-600 hover:text-white transition">
                                        {processForm.final_file ? processForm.final_file.name : 'اختر ملف PDF'}
                                    </label>
                                </div>

                                <div className="p-8 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/30 flex flex-col items-center gap-4 group hover:border-emerald-300 transition">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-3xl group-hover:scale-110 transition">🖼️</div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-emerald-900">صورة البحث (Thumbnail)</p>
                                        <p className="text-[10px] text-gray-400 mt-1">تظهر في الأرشيف والبحث</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden" 
                                        id="thumbnail-upload"
                                        onChange={e => setProcessForm({...processForm, thumbnail: e.target.files[0]})}
                                    />
                                    <label htmlFor="thumbnail-upload" className="px-6 py-2.5 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-xs font-black cursor-pointer hover:bg-emerald-600 hover:text-white transition">
                                        {processForm.thumbnail ? processForm.thumbnail.name : 'اختر صورة'}
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">تحديث وحفظ البيانات</button>
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-black text-amber-950 mb-2">مدة الانتظار في طابور النشر (أيام)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-4 bg-amber-50/30 border border-amber-100 rounded-2xl outline-none focus:border-amber-500 transition font-bold text-sm"
                                            value={processForm.publish_delay_days}
                                            onChange={e => setProcessForm({...processForm, publish_delay_days: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={handleMarkReady}
                                        className="mt-7 px-8 py-4 bg-amber-600 text-white rounded-2xl font-black shadow-lg shadow-amber-100 hover:bg-amber-700 transition flex items-center gap-2"
                                    >
                                        <span>⏱️</span>
                                        اعتماد وجدولة النشر
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold text-center italic">ملاحظة: سيتم نقل البحث لحالة "جاهز للنشر" ونشره تلقائياً بعد انقضاء المدة المحددة.</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
