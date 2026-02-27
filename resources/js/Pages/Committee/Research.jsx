import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

export default function CommitteeResearch() {
    const [papers, setPapers] = useState([]);
    const [stats, setStats] = useState({
        total_papers: 0,
        under_review: 0,
        pending_decision: 0,
        accepted: 0
    });
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.endsWith('/decisions')) {
            setFilterStatus('submitted');
        } else if (location.pathname.endsWith('/sort')) {
            setSortBy('title');
            setSortOrder('asc');
        } else {
            setFilterStatus('all');
        }
    }, [location.pathname]);

    const fetchPapers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/committee/papers', {
                params: {
                    page: page,
                    status: filterStatus !== 'all' ? filterStatus : undefined,
                    search: searchQuery,
                    sort_by: sortBy,
                    sort_order: sortOrder
                }
            });
            setPapers(response.data.data);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error('Error fetching papers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Re-using committee stats endpoint for now, or could create specific one for papers
            // optimizing: filter client side or added specific stats endpoint later
            // For now using the main stats endpoint which gives total_papers.
            // But we need breakdown. 
            // Let's mock the breakdown or fetch separate counts if needed.
            // For this iteration, let's keep stats static or simple until backend supports breakdown.
            // We'll trust the main stats for total.
            const response = await axios.get('/api/committee/stats');
            setStats(prev => ({
                ...prev,
                total_papers: response.data.total_papers
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchPapers();
    }, [page, filterStatus, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleExport = () => {
        window.location.href = '/api/committee/papers/export';
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'submitted': return { text: 'مقدم حديثاً', color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-600' };
            case 'incomplete': return { text: 'بيانات ناقصة', color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-600' };
            case 'under_review': return { text: 'قيد التحكيم', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600' };
            case 'accepted': return { text: 'مقبول نهائياً', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-600' };
            case 'rejected': return { text: 'مرفوض', color: 'bg-red-50 text-red-600', dot: 'bg-red-600' };
            case 'revision_requested': return { text: 'مطلوب تعديل', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-600' };
            case 'withdrawn': return { text: 'منسحب', color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };
            default: return { text: 'غير معروف', color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };
        }
    };

    const handleSearch = (e) => {
        // Debounce could be added here
        if (e.key === 'Enter') {
            setPage(1);
            fetchPapers();
        }
    };

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [showScreeningModal, setShowScreeningModal] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [reviewers, setReviewers] = useState([]);
    const [assignForm, setAssignForm] = useState({ reviewer_id: '', due_date: '' });
    const [decisionForm, setDecisionForm] = useState({ decision: '', notes: '' });
    const [screeningForm, setScreeningForm] = useState({ status: '', notes: '', plagiarism_ratio: '', format_match: true });

    const openAssignModal = async (paper) => {
        setSelectedPaper(paper);
        setShowAssignModal(true);
        // Fetch reviewers if not already fetched
        if (reviewers.length === 0) {
            try {
                const res = await axios.get('/api/committee/reviewers');
                setReviewers(res.data);
            } catch (err) {
                console.error('Failed to fetch reviewers', err);
            }
        }
    };

    const openDecisionModal = (paper) => {
        setSelectedPaper(paper);
        setShowDecisionModal(true);
    };

    const openScreeningModal = (paper) => {
        setSelectedPaper(paper);
        setShowScreeningModal(true);
    };

    const closeModals = () => {
        setShowAssignModal(false);
        setShowDecisionModal(false);
        setShowScreeningModal(false);
        setSelectedPaper(null);
        setAssignForm({ reviewer_id: '', due_date: '' });
        setDecisionForm({ decision: '', notes: '' });
        setScreeningForm({ status: '', notes: '', plagiarism_ratio: '', format_match: true });
    };

    const submitAssignment = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/committee/papers/${selectedPaper.id}/assign`, assignForm);
            alert('تم إسناد المحكم بنجاح');
            closeModals();
            fetchPapers();
        } catch (err) {
            alert('فشل الإسناد: ' + (err.response?.data?.message || err.message));
        }
    };

    const submitDecision = async (e) => {
        e.preventDefault();
        try {
            const endpoint = decisionForm.decision === 'finalize' 
                ? `/api/papers/${selectedPaper.id}/finalize` 
                : `/api/committee/papers/${selectedPaper.id}/decision`;
            
            await axios.post(endpoint, decisionForm);
            alert('تم حفظ القرار بنجاح');
            closeModals();
            fetchPapers();
        } catch (err) {
            alert('فشل حفظ القرار: ' + (err.response?.data?.message || err.message));
        }
    };

    const submitScreening = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/papers/${selectedPaper.id}/screening`, screeningForm);
            alert('تم حفظ نتيجة الفحص بنجاح');
            closeModals();
            fetchPapers();
        } catch (err) {
            alert('فشل حفظ نتيجة الفحص: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">إدارة الأبحاث العلمية</h1>
                    <p className="text-gray-500 font-medium">مراقبة، مراجعة، وتوزيع الأبحاث العلمية على المحكمين</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleExport} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition shadow-sm">📥 تصدير البيانات</button>
                    {/* <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition">🔍 فرز متقدم</button> */}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {['إجمالي الأبحاث', 'قيد التحكيم', 'بانتظار قرار', 'مقبولة'].map((title, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
                            <h4 className="text-2xl font-black text-emerald-950 mt-1">
                                {i === 0 ? stats.total_papers : '-'}
                            </h4>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">📊</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                    <div className="flex gap-3">
                        {[
                            { label: 'الكل', value: 'all' },
                            { label: 'قيد التحكيم', value: 'under_review' },
                            { label: 'مقدم حديثاً', value: 'submitted' },
                            { label: 'مقبول', value: 'accepted' }
                        ].map((tab, i) => (
                            <button 
                                key={i} 
                                onClick={() => setFilterStatus(tab.value)}
                                className={`px-5 py-2 rounded-xl text-xs font-black transition ${filterStatus === tab.value ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4 items-center">
                        <select 
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-black outline-none focus:border-emerald-500"
                        >
                            <option value="created_at-desc">الأحدث أولاً</option>
                            <option value="created_at-asc">الأقدم أولاً</option>
                            <option value="title-asc">العنوان (أ-ي)</option>
                            <option value="plagiarism_ratio-desc">الأعلى اقتباساً</option>
                            <option value="plagiarism_ratio-asc">الأقل اقتباساً</option>
                        </select>
                        <div className="relative">
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-64 bg-white border border-gray-200 rounded-xl px-10 py-2 text-xs font-medium outline-none focus:border-emerald-500" 
                                placeholder="بحث عن عنوان أو باحث..." 
                            />
                            <span className="absolute right-4 top-2">🔍</span>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse min-w-[800px]">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">معلومات البحث</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المؤتمر</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المحكمون</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400">جاري التحميل...</td>
                                </tr>
                            ) : papers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-400">لا توجد أبحاث</td>
                                </tr>
                            ) : papers.map((paper) => {
                                const status = getStatusLabel(paper.status);
                                return (
                                    <tr key={paper.id} className="hover:bg-gray-50/50 transition duration-300">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl text-gray-400">📄</div>
                                                <div>
                                                    <h5 className="font-black text-emerald-950 line-clamp-1 max-w-[200px]" title={paper.title}>{paper.title}</h5>
                                                    <p className="text-xs font-bold text-gray-400 mt-1">{paper.author?.full_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 whitespace-nowrap">
                                            <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg truncate max-w-[150px] inline-block" title={paper.conference?.title}>
                                                {paper.conference?.title || 'غير محدد'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex -space-x-reverse space-x-2">
                                                {paper.reviewers && paper.reviewers.length > 0 ? (
                                                    paper.reviewers.map((r, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title={r.full_name}>
                                                            {r.full_name.charAt(0)}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <button onClick={() => openAssignModal(paper)} className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100 italic hover:bg-amber-100 transition">بانتظار الإسناد</button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${status.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                <span className="text-[10px] font-black">{status.text}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <a href={`/storage_file/${paper.file_path}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="عرض الملف">
                                                    👁️
                                                </a>
                                                <button onClick={() => openScreeningModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="الفحص الأولي">📋</button>
                                                <button onClick={() => openAssignModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="إسناد محكم">🔗</button>
                                                <button onClick={() => openDecisionModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="اتخاذ قرار">⚖️</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-gray-50 flex justify-center gap-2">
                   <button 
                       disabled={page === 1} 
                       onClick={() => setPage(p => p - 1)}
                       className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50"
                   >
                       السابق
                   </button>
                   <span className="px-4 py-2 text-sm text-gray-600">صفحة {page} من {lastPage}</span>
                   <button 
                       disabled={page === lastPage} 
                       onClick={() => setPage(p => p + 1)}
                       className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50"
                   >
                       التالي
                   </button>
                </div>
            </div>
            
            <div className="bg-emerald-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-emerald-900/30">
                <div className="flex-1 space-y-4 text-center md:text-right">
                    <h3 className="text-2xl font-black">جاهز للتحكيم النهائي؟</h3>
                    <p className="text-emerald-200/80 font-medium">يمكنك الآن إغلاق باب التقديم والبدء في عملية الفرز النهائي وإصدار التوصيات لجميع الأبحاث المكتملة لدفعها نحو الجلسات العلمية.</p>
                </div>
                <button className="px-10 py-5 bg-white text-emerald-950 font-black rounded-3xl hover:bg-emerald-50 transition transform hover:scale-105 active:scale-95 shadow-xl">إطلاق عملية التحكيم النهائي 🚀</button>
            </div>

            {/* Modals */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">إسناد محكم للبحث</h3>
                        <p className="text-sm text-gray-500 mb-4 font-bold">{selectedPaper?.title}</p>
                        <form onSubmit={submitAssignment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">اختر المحكم</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={assignForm.reviewer_id}
                                    onChange={e => setAssignForm({...assignForm, reviewer_id: e.target.value})}
                                    required
                                >
                                    <option value="">اختر...</option>
                                    {reviewers.map(r => (
                                        <option key={r.id} value={r.id}>{r.full_name} ({r.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الاستحقاق</label>
                                <input 
                                    type="date"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={assignForm.due_date}
                                    onChange={e => setAssignForm({...assignForm, due_date: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">إسناد</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDecisionModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">اتخاذ قرار نهائي</h3>
                        <p className="text-sm text-gray-500 mb-4 font-bold">{selectedPaper?.title}</p>
                        <form onSubmit={submitDecision} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">القرار</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={decisionForm.decision}
                                    onChange={e => setDecisionForm({...decisionForm, decision: e.target.value})}
                                    required
                                >
                                    <option value="">اختر...</option>
                                    <option value="accept">قبول</option>
                                    <option value="finalize">قبول نهائي (Final Acceptance)</option>
                                    <option value="reject">رفض</option>
                                    <option value="revision_requested">طلب تعديلات</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات القرار</label>
                                <textarea 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none h-32"
                                    value={decisionForm.notes}
                                    onChange={e => setDecisionForm({...decisionForm, notes: e.target.value})}
                                    placeholder="اكتب ملاحظات للمؤلف..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">حفظ القرار</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showScreeningModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">الفحص الأولي للبحث</h3>
                        <p className="text-sm text-gray-500 mb-4 font-bold">{selectedPaper?.title}</p>
                        <form onSubmit={submitScreening} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">نتيجة الفحص</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={screeningForm.status}
                                    onChange={e => setScreeningForm({...screeningForm, status: e.target.value})}
                                    required
                                >
                                    <option value="">اختر النتيجة...</option>
                                    <option value="accepted_for_review">مقبول للتحكيم (Proceed to Review)</option>
                                    <option value="desk_rejection">مرفوض فوراً (Desk Rejection)</option>
                                    <option value="incomplete">بيانات ناقصة (Incomplete)</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">نسبة الاقتباس (%)</label>
                                    <input 
                                        type="number"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={screeningForm.plagiarism_ratio}
                                        onChange={e => setScreeningForm({...screeningForm, plagiarism_ratio: e.target.value})}
                                        placeholder="مثال: 15"
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                                        <input 
                                            type="checkbox"
                                            checked={screeningForm.format_match}
                                            onChange={e => setScreeningForm({...screeningForm, format_match: e.target.checked})}
                                            className="w-5 h-5 rounded border-gray-300"
                                        />
                                        <span className="text-sm font-bold text-gray-700">مطابق للقالب</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات الفحص</label>
                                <textarea 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none h-24"
                                    value={screeningForm.notes}
                                    onChange={e => setScreeningForm({...screeningForm, notes: e.target.value})}
                                    placeholder="اكتب أسباب الرفض أو النواقص..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">حفظ النتيجة</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
