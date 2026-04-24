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
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch (e) {
            return {};
        }
    });

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
            case 'under_screening': return { text: 'جاري الفحص الأولي', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-600' };
            case 'resubmitted': return { text: 'تم إعادة الإرسال', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-600' };
            case 'revision_required': return { text: 'مطلوب تعديل', color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-600' };
            case 'with_editor': return { text: 'مع المحرر العلمي', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600' };
            case 'under_review': return { text: 'قيد التحكيم', color: 'bg-cyan-50 text-cyan-600', dot: 'bg-cyan-600' };
            case 'accepted': return { text: 'مقبول نهائياً', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-600' };
            case 'rejected': return { text: 'مرفوض', color: 'bg-red-50 text-red-600', dot: 'bg-red-600' };
            case 'withdrawn': return { text: 'منسحب', color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };
            default: return { text: status, color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };
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
    const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
    const [showAggregationModal, setShowAggregationModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [reviewers, setReviewers] = useState([]);
    const [assignForm, setAssignForm] = useState({ reviewer_id: '', due_date: '' });
    const [decisionForm, setDecisionForm] = useState({ decision: '', notes: '' });
    const [screeningForm, setScreeningForm] = useState({ result: '', notes: '', plagiarism_ratio: '', format_check: true });
    const [anonymizeForm, setAnonymizeForm] = useState({ blind_file: null, notes: '' });
    const [publishForm, setPublishForm] = useState({ doi: '', page_numbers: '' });
    const [aggregationData, setAggregationData] = useState(null);

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

    const openAnonymizeModal = (paper) => {
        setSelectedPaper(paper);
        setShowAnonymizeModal(true);
    };

    const openAggregationModal = async (paper) => {
        setSelectedPaper(paper);
        setShowAggregationModal(true);
        try {
            const res = await axios.get(`/api/committee/papers/${paper.id}/reviews-aggregation`);
            setAggregationData(res.data.aggregation);
        } catch (err) {
            console.error('Failed to fetch aggregation', err);
        }
    };

    const openPublishModal = (paper) => {
        setSelectedPaper(paper);
        setShowPublishModal(true);
    };

    const closeModals = () => {
        setShowAssignModal(false);
        setShowDecisionModal(false);
        setShowScreeningModal(false);
        setShowAnonymizeModal(false);
        setShowAggregationModal(false);
        setShowPublishModal(false);
        setSelectedPaper(null);
        setAssignForm({ reviewer_id: '', due_date: '' });
        setDecisionForm({ decision: '', notes: '' });
        setScreeningForm({ result: '', notes: '', plagiarism_ratio: '', format_check: true });
        setAnonymizeForm({ blind_file: null, notes: '' });
        setPublishForm({ doi: '', page_numbers: '' });
        setAggregationData(null);
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

    const submitPublish = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/committee/papers/${selectedPaper.id}/mark-as-published`, publishForm);
            alert('تم نشر البحث بنجاح');
            closeModals();
            fetchPapers();
        } catch (err) {
            alert('فشل النشر: ' + (err.response?.data?.message || err.message));
        }
    };

    const submitAnonymize = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('blind_file', anonymizeForm.blind_file);
        formData.append('notes', anonymizeForm.notes);

        try {
            await axios.post(`/api/papers/${selectedPaper.id}/anonymize`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('تم رفع النسخة المخفية بنجاح');
            closeModals();
            fetchPapers();
        } catch (err) {
            alert('فشل الرفع: ' + (err.response?.data?.message || err.message));
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
                            { label: 'الفحص الأولي', value: 'under_screening' },
                            { label: 'تم التعديل', value: 'resubmitted' },
                            { label: 'مع المحرر', value: 'with_editor' },
                            { label: 'قيد التحكيم', value: 'under_review' },
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
                                                {paper.author_id === user.id ? (
                                                    <div className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-lg border border-red-100 flex items-center gap-1">
                                                        <span>⚠️</span>
                                                        <span>تضارب مصالح</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={() => openScreeningModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="الفحص الأولي">📋</button>
                                                        <button onClick={() => openAnonymizeModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="إخفاء الهوية">👤</button>
                                                        <button onClick={() => openAssignModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="إسناد محكم">🔗</button>
                                                        <button onClick={() => openAggregationModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="تجميع التقييمات">📊</button>
                                                        <button onClick={() => openDecisionModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="اتخاذ قرار">⚖️</button>
                                                        <button onClick={() => openPublishModal(paper)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition" title="نشر البحث">🌐</button>
                                                    </>
                                                )}
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
                                    value={screeningForm.result}
                                    onChange={e => setScreeningForm({...screeningForm, result: e.target.value})}
                                    required
                                >
                                    <option value="">اختر الإجراء...</option>
                                    <option value="technical_pass">نجاح الفحص الفني (تحويل للمحرر العلمي)</option>
                                    <option value="technical_fail">فشل الفحص الفني (إعادة للباحث)</option>
                                    <option value="scientific_pass">قبول للتحكيم العلمي (إرسال للمحكمين)</option>
                                    <option value="desk_reject">رفض مكتبي (Desk Rejection)</option>
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
                                            checked={screeningForm.format_check}
                                            onChange={e => setScreeningForm({...screeningForm, format_check: e.target.checked})}
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

            {showAnonymizeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6 font-['Cairo']">إخفاء هوية البحث (Anonymization)</h3>
                        <p className="text-sm text-gray-500 mb-6 font-bold">{selectedPaper?.title}</p>
                        <form onSubmit={submitAnonymize} className="space-y-6">
                            <div className="p-6 border-2 border-dashed border-emerald-100 rounded-2xl bg-emerald-50/30 flex flex-col items-center gap-3">
                                <span className="text-3xl">📄</span>
                                <p className="text-xs font-black text-emerald-900">رفع نسخة PDF بدون أسماء المؤلفين</p>
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={e => setAnonymizeForm({...anonymizeForm, blind_file: e.target.files[0]})}
                                    className="hidden" 
                                    id="blind-file-upload"
                                    required
                                />
                                <label htmlFor="blind-file-upload" className="px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-black cursor-pointer hover:bg-emerald-50 transition">
                                    {anonymizeForm.blind_file ? anonymizeForm.blind_file.name : 'اختر ملف PDF'}
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات</label>
                                <textarea 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none h-24"
                                    value={anonymizeForm.notes}
                                    onChange={e => setAnonymizeForm({...anonymizeForm, notes: e.target.value})}
                                    placeholder="ملاحظات اختيارية..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">رفع وحفظ</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAggregationModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-black text-emerald-950 font-['Cairo']">تجميع نتائج التحكيم (Aggregation)</h3>
                            <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        {!aggregationData ? (
                            <div className="py-20 text-center text-gray-400 font-bold">جاري تحليل البيانات...</div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">متوسط التقييم</p>
                                        <h4 className="text-3xl font-black text-emerald-950 mt-1">{aggregationData.average_score} / 10</h4>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">عدد المحكمين</p>
                                        <h4 className="text-3xl font-black text-emerald-950 mt-1">{aggregationData.count}</h4>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-black text-emerald-950 mb-4">توزيع القرارات</h4>
                                    <div className="space-y-3">
                                        {Object.entries(aggregationData.decision_counts).map(([decision, count]) => (
                                            <div key={decision} className="flex items-center gap-4">
                                                <span className="w-24 text-xs font-bold text-gray-500">{decision}</span>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${decision === 'accept' ? 'bg-emerald-500' : decision === 'reject' ? 'bg-red-500' : 'bg-amber-500'}`} 
                                                        style={{ width: `${(count / aggregationData.count) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-emerald-950">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-6 rounded-2xl border ${aggregationData.contradiction_detected ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xl">{aggregationData.contradiction_detected ? '⚠️' : '💡'}</span>
                                        <h4 className={`font-black ${aggregationData.contradiction_detected ? 'text-red-950' : 'text-blue-950'}`}>التوصية المقترحة</h4>
                                    </div>
                                    <p className="text-sm font-bold text-gray-600 mb-4">
                                        {aggregationData.contradiction_detected 
                                            ? 'تم اكتشاف تناقض في قرارات المحكمين (قبول ورفض في نفس الوقت). يرجى مراجعة التقارير بدقة أو تعيين محكم ثالث.' 
                                            : `بناءً على متوسط التقييم وتوزيع القرارات، يقترح النظام: ${aggregationData.suggested_decision}`}
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setDecisionForm({...decisionForm, decision: aggregationData.suggested_decision});
                                            setShowAggregationModal(false);
                                            setShowDecisionModal(true);
                                        }}
                                        className={`px-5 py-2 rounded-xl text-xs font-black transition ${aggregationData.contradiction_detected ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
                                    >
                                        تنفيذ هذا القرار
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showPublishModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6 font-['Cairo']">إصدار ونشر البحث (Publication)</h3>
                        <p className="text-sm text-gray-500 mb-6 font-bold">{selectedPaper?.title}</p>
                        <form onSubmit={submitPublish} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم المعرف الرقمي (DOI)</label>
                                <input 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={publishForm.doi}
                                    onChange={e => setPublishForm({...publishForm, doi: e.target.value})}
                                    placeholder="مثال: 10.1234/uoms.2026.001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">أرقام الصفحات</label>
                                <input 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={publishForm.page_numbers}
                                    onChange={e => setPublishForm({...publishForm, page_numbers: e.target.value})}
                                    placeholder="مثال: 45-60"
                                />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                                <span className="text-xl">📢</span>
                                <p className="text-xs text-blue-900 leading-relaxed font-bold">
                                    عند تأكيد النشر، سيصل إشعار للباحث برابط النشر النهائي وسجل الأرقام المعيارية.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">تأكيد النشر النهائي</button>
                                <button type="button" onClick={closeModals} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
