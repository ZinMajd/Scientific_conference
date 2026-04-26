import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Can from '../../../components/Can';

export default function ResearcherResearch() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/researcher/papers', { headers: { 'Accept': 'application/json' } })
            .then(response => {
                setPapers(response.data.papers || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching papers:", error);
                setLoading(false);
            });
    }, []);

    const getStatusInfo = (status) => {
        switch(status) {
            case 'under_review': return { text: 'قيد التحكيم', color: 'bg-blue-50 text-blue-600', icon: '⚖️' };
            case 'accepted': return { text: 'مقبول نهائياً', color: 'bg-emerald-50 text-emerald-600', icon: '✅' };
            case 'rejected': return { text: 'مرفوض', color: 'bg-red-50 text-red-600', icon: '❌' };
            case 'submitted': return { text: 'تم التقديم', color: 'bg-gray-50 text-gray-600', icon: '📨' };
            case 'under_screening': return { text: 'الفحص الأولي', color: 'bg-amber-50 text-amber-600', icon: '🔍' };
            case 'with_editor': return { text: 'مع المحرر العلمي', color: 'bg-indigo-50 text-indigo-600', icon: '👨‍🏫' };
            case 'revision_required': return { text: 'مطلوب تعديل', color: 'bg-rose-50 text-rose-600', icon: '⚠️' };
            case 'resubmitted': return { text: 'تم إعادة الإرسال', color: 'bg-purple-50 text-purple-600', icon: '♻️' };
            case 'scheduled': return { text: 'تمت الجدولة', color: 'bg-teal-50 text-teal-600', icon: '📅' };
            case 'published': return { text: 'منشور', color: 'bg-sky-50 text-sky-600', icon: '📑' };
            default: return { text: status, color: 'bg-gray-50 text-gray-600', icon: '❓' };
        }
    };

    const handleDelete = (paperId, paperTitle) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في سحب البحث "${paperTitle}"؟\n\nملاحظة: لن تتمكن من استرجاعه بعد الحذف.`)) {
             const token = localStorage.getItem('token');
             axios.delete(`/researcher/papers/${paperId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
             })
             .then(() => {
                 setPapers(papers.filter(p => p.id !== paperId));
                 alert('تم سحب البحث بنجاح.');
             })
             .catch(err => {
                 console.error(err);
                 alert('حدث خطأ أثناء محاولة حذف البحث.');
             });
        }
    };

    if (loading) {
        return <div className="text-center py-20 font-bold text-gray-400">جاري تحميل الأبحاث...</div>;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">أبحاثي العلمية</h1>
                    <p className="text-gray-500 font-medium">متابعة حالة أوراقك البحثية المقدمة للمؤتمرات</p>
                </div>
                <Can permission="paper.create">
                    <Link to="/researcher/research/create" className="px-8 py-4 bg-blue-950 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-900 transition flex items-center gap-3">
                        <span className="text-xl">➕</span> تقديم بحث جديد
                    </Link>
                </Can>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">إجمالي الأبحاث</p>
                    <h3 className="text-2xl font-black text-blue-950 mt-1">{papers.length}</h3>
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm">
                    <p className="text-amber-600/60 text-[10px] font-black uppercase tracking-widest">المحرر / المكتب</p>
                    <h3 className="text-2xl font-black text-amber-700 mt-1">{papers.filter(p => ['under_screening', 'with_editor', 'revision_required', 'resubmitted'].includes(p.status)).length}</h3>
                </div>
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                    <p className="text-blue-600/60 text-[10px] font-black uppercase tracking-widest">قيد التحكيم</p>
                    <h3 className="text-2xl font-black text-blue-700 mt-1">{papers.filter(p => p.status === 'under_review').length}</h3>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                    <p className="text-emerald-600/60 text-[10px] font-black uppercase tracking-widest">المقبولة</p>
                    <h3 className="text-2xl font-black text-emerald-700 mt-1">{papers.filter(p => ['accepted', 'scheduled', 'published'].includes(p.status)).length}</h3>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest">البحث</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest">المؤتمر</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest text-center">الحالة</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {papers.map((paper) => {
                            const status = getStatusInfo(paper.status);
                            return (
                                <tr key={paper.id} className="hover:bg-gray-50/30 transition group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition">📄</div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-950 transition line-clamp-1">{paper.title}</h4>
                                                <p className="text-xs text-gray-400 font-medium mt-1">تاريخ التقديم: {paper.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-sm font-bold text-gray-600">{paper.conf}</span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 mx-auto w-fit ${status.color}`}>
                                            <span>{status.icon}</span>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link to={`/researcher/research/${paper.id}`} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center" title="عرض التفاصيل">👁️</Link>
                                            {paper.status === 'revision_requested' && (
                                                <Link to={`/researcher/research/${paper.id}/revision`} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition flex items-center justify-center" title="تقديم التعديلات">📤</Link>
                                            )}
                                            <Link to="/researcher/reviews" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center justify-center" title="سجل التحكيم">📜</Link>
                                            
                                            <Can permission="paper.edit_draft">
                                                <Link to={`/researcher/research/${paper.id}/edit`} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition flex items-center justify-center" title="تعديل">✏️</Link>
                                            </Can>

                                            <Can permission="paper.withdraw">
                                                <button onClick={() => handleDelete(paper.id, paper.title)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center" title="سحب البحث">🗑️</button>
                                            </Can>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {papers.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-bold">لم تقم بتقديم أي أبحاث حتى الآن.</div>
                )}
            </div>
        </div>
    );
}
