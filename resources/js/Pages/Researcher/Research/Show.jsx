import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResearcherResearchShow() {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`/researcher/papers/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setPaper(response.data.paper);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError('فشل في تحميل تفاصيل البحث.');
            setLoading(false);
        });
    }, [id]);

    const getStatusInfo = (status) => {
        switch(status) {
            case 'under_review': return { text: 'قيد التحكيم', color: 'bg-blue-50 text-blue-600', icon: '⚖️' };
            case 'accepted': return { text: 'مقبول', color: 'bg-emerald-50 text-emerald-600', icon: '✅' };
            case 'rejected': return { text: 'مرفوض', color: 'bg-red-50 text-red-600', icon: '❌' };
            case 'submitted': return { text: 'مقدم', color: 'bg-gray-50 text-gray-600', icon: '📨' };
            default: return { text: status, color: 'bg-gray-50 text-gray-600', icon: '❓' };
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">جاري التحميل...</div>;
    if (error) return <div className="text-center py-20 font-bold text-red-500">{error}</div>;
    if (!paper) return <div className="text-center py-20 font-bold text-gray-400">البحث غير موجود.</div>;

    const statusInfo = getStatusInfo(paper.status);

    const steps = [
        { key: 'submitted', label: 'قيد الفحص', icon: '📝' },
        { key: 'under_review', label: 'قيد التحكيم', icon: '⚖️' },
        { key: 'decision', label: paper.status === 'rejected' ? 'مرفوض' : 'مقبول', icon: paper.status === 'rejected' ? '❌' : '✅' }
    ];

    const getCurrentStepIndex = () => {
        if (paper.status === 'submitted') return 0;
        if (paper.status === 'under_review') return 1;
        if (paper.status === 'accepted' || paper.status === 'rejected') return 2;
        return 0;
    };

    const currentStep = getCurrentStepIndex();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20">
            <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">{paper.title}</h1>
                    <p className="text-gray-500 mt-2 font-medium">تم التقديم في: {new Date(paper.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex gap-3">
                    <Link to={`/researcher/research/${paper.id}/edit`} className="px-6 py-3 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-100 transition">تعديل</Link>
                    <Link to="/researcher/research" className="px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition">عودة</Link>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-blue-950 mb-8">متابعة حالة البحث</h3>
                <div className="relative flex justify-between">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                    
                    {/* Active Progress Bar */}
                    <div 
                        className={`absolute top-1/2 right-0 h-1 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out ${paper.status === 'rejected' ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, index) => {
                        let statusColor = 'bg-gray-100 text-gray-400 border-gray-200'; // Default pending
                        let isCompleted = index <= currentStep;
                        
                        if (isCompleted) {
                            if (index === currentStep && paper.status === 'rejected') {
                                statusColor = 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30';
                            } else if (index === currentStep && paper.status === 'under_review') {
                                statusColor = 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 ring-4 ring-blue-100';
                            } else if (index === currentStep && paper.status === 'submitted') {
                                statusColor = 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 ring-4 ring-blue-100';
                            } else {
                                // Completed past steps
                                statusColor = 'bg-emerald-500 text-white border-emerald-500';
                            }
                            
                            // Specific check for final step acceptance/rejection visual
                            if (index === 2) { 
                                if (paper.status === 'accepted') statusColor = 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30';
                                if (paper.status === 'rejected') statusColor = 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30';
                            }
                        }

                        return (
                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-500 ${statusColor}`}>
                                    {isCompleted ? step.icon : index + 1}
                                </div>
                                <span className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-blue-950 mb-4 border-b border-gray-50 pb-4">الملخص</h3>
                        <p className="leading-loose text-gray-600 font-medium text-justify">{paper.abstract}</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-blue-950 mb-4 border-b border-gray-50 pb-4">المشاركون في البحث</h3>
                        <div className="space-y-4">
                            {paper.coauthors && paper.coauthors.map((author, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{author.full_name}</h4>
                                        <p className="text-xs text-gray-500">{author.email} - {author.affiliation}</p>
                                    </div>
                                </div>
                            ))}
                            {(!paper.coauthors || paper.coauthors.length === 0) && <div className="text-gray-400 text-sm">لا يوجد مشاركون.</div>}
                        </div>
                    </div>

                    {paper.assignments && paper.assignments.some(a => a.review) && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-r-4 border-r-indigo-500">
                            <h3 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-3">
                                <span>📜</span> ملاحظات ونتائج التحكيم
                            </h3>
                            <div className="space-y-8">
                                {paper.assignments.map((assignment, index) => {
                                    if (!assignment.review) return null;
                                    const decision = (() => {
                                        switch (assignment.review.decision) {
                                            case 'accept': return { text: 'قبول', color: 'bg-emerald-50 text-emerald-600' };
                                            case 'minor_revision': return { text: 'تعديلات طفيفة', color: 'bg-blue-50 text-blue-600' };
                                            case 'major_revision': return { text: 'تعديلات جوهرية', color: 'bg-amber-50 text-amber-600' };
                                            case 'reject': return { text: 'رفض', color: 'bg-red-50 text-red-600' };
                                            default: return { text: assignment.review.decision, color: 'bg-gray-50 text-gray-600' };
                                        }
                                    })();

                                    return (
                                        <div key={assignment.id} className="p-6 bg-gray-50/50 rounded-2xl space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">#{index + 1}</span>
                                                    <span className="font-bold text-indigo-900">مراجعة المحكم</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${decision.color}`}>
                                                        {decision.text}
                                                    </span>
                                                    <span className="px-3 py-1 bg-white text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black">
                                                        {assignment.review.overall_score}/10
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl text-sm leading-relaxed text-gray-600 whitespace-pre-line border border-gray-100 italic">
                                                "{assignment.review.comments_author || 'لا توجد تعليقات نصية.'}"
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-950 p-8 rounded-3xl text-white shadow-xl shadow-blue-900/20">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">الحالة</p>
                                <span className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 w-fit ${statusInfo.color.replace('bg-', 'bg-white/10 ').replace('text-', 'text-white ')}`}>
                                    <span>{statusInfo.icon}</span>
                                    {statusInfo.text}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">المؤتمر</p>
                                <p className="font-bold mt-1 text-blue-200">{paper.conference?.title || 'غير محدد'}</p>
                            </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">الكلمات المفتاحية</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {paper.keywords.split(',').map((k, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs">{k.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {paper.file_path && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                            <div className="text-5xl mb-4">📄</div>
                            <h4 className="font-bold text-gray-900 line-clamp-1 mb-6 text-sm" dir="ltr">{paper.file_name}</h4>
                            <a href={`/storage/${paper.file_path}`} target="_blank" download className="block w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition">تحميل الملف</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
