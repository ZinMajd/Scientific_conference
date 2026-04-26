import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ResearcherResearchShow() {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [cameraReadyFile, setCameraReadyFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`/researcher/papers/${id}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.data.paper) {
                setPaper(response.data.paper);
            } else {
                setPaper(response.data); // Fallback in case it's not wrapped
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Error loading paper details:", err);
            const msg = err.response?.data?.message || 'فشل في تحميل تفاصيل البحث.';
            setError(msg);
            setLoading(false);
        });
    }, [id]);

    const getStatusInfo = (status) => {
        switch(status) {
            case 'under_screening': return { text: 'جاري الفحص الأولي (مكتب التحرير)', color: 'bg-amber-50 text-amber-600', icon: '🔍' };
            case 'resubmitted': return { text: 'تم إعادة الإرسال (بانتظار الفحص)', color: 'bg-purple-50 text-purple-600', icon: '♻️' };
            case 'revision_required': return { text: 'مطلوب تعديلات (بيانات ناقصة)', color: 'bg-rose-50 text-rose-600', icon: '⚠️' };
            case 'with_editor': return { text: 'مع المحرر العلمي (التقييم الأولي)', color: 'bg-blue-50 text-blue-600', icon: '👨‍🏫' };
            case 'under_review': return { text: 'قيد التحكيم (Peer Review)', color: 'bg-cyan-50 text-cyan-600', icon: '⚖️' };
            case 'accepted': return { text: 'مقبول نهائياً', color: 'bg-emerald-50 text-emerald-600', icon: '✅' };
            case 'scheduled': return { text: 'مجدول في جلسات المؤتمر', color: 'bg-indigo-50 text-indigo-600', icon: '📅' };
            case 'published': return { text: 'منشور في السجل العلمي', color: 'bg-blue-50 text-blue-600', icon: '🌐' };
            case 'rejected': return { text: 'مرفوض', color: 'bg-red-50 text-red-600', icon: '❌' };
            case 'submitted': return { text: 'تم الاستلام', color: 'bg-gray-50 text-gray-600', icon: '📨' };
            default: return { text: status, color: 'bg-gray-50 text-gray-600', icon: '❓' };
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-400">جاري التحميل...</div>;
    if (error) return <div className="text-center py-20 font-bold text-red-500">{error}</div>;
    if (!paper) return <div className="text-center py-20 font-bold text-gray-400">البحث غير موجود.</div>;

    const statusInfo = getStatusInfo(paper.status);

    const steps = [
        { key: 'submitted', label: 'التقديم', icon: '📨' },
        { key: 'technical', label: 'الفحص الفني', icon: '🔍' },
        { key: 'scientific', label: 'المحرر العلمي', icon: '👨‍🏫' },
        { key: 'review', label: 'التحكيم', icon: '⚖️' },
        { key: 'decision', label: 'القرار النهائي', icon: paper.status === 'rejected' ? '❌' : (paper.status === 'accepted' ? '✅' : '🏁') }
    ];

    const getCurrentStepIndex = () => {
        const s = paper.status;
        if (s === 'submitted') return 0;
        if (['under_screening', 'revision_required', 'resubmitted'].includes(s)) return 1;
        if (s === 'with_editor') return 2;
        if (s === 'under_review') return 3;
        if (['accepted', 'rejected', 'scheduled', 'published'].includes(s)) return 4;
        return 0;
    };


    const handleCameraReadyUpload = async (e) => {
        e.preventDefault();
        if (!cameraReadyFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('camera_ready_file', cameraReadyFile);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/researcher/papers/${paper.id}/camera-ready`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('تم رفع النسخة النهائية بنجاح');
            window.location.reload();
        } catch (err) {
            alert('فشل الرفع: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
        }
    };

    const currentStep = getCurrentStepIndex();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">{paper.title}</h1>
                    <p className="text-gray-500 mt-2 font-medium">تم التقديم في: {paper.created_at ? new Date(paper.created_at).toLocaleDateString('ar-EG') : '---'}</p>
                </div>
                <div className="flex gap-3">
                    {['submitted', 'revision_required'].includes(paper.status) && (
                        <Link to={`/researcher/research/${paper.id}/edit`} className="px-6 py-3 bg-amber-50 text-amber-600 font-bold rounded-xl hover:bg-amber-100 transition">تعديل البحث</Link>
                    )}
                    <Link to="/researcher/research" className="px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition">عودة للقائمة</Link>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100" dir="rtl">
                <h3 className="text-xl font-black text-blue-950 mb-12 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    تتبع حالة البحث
                </h3>
                
                <div className="relative px-4">
                    {/* Progress Bar Background (Gray Line) */}
                    <div className="absolute top-7 left-10 right-10 h-1 bg-gray-100 z-0"></div>
                    
                    {/* Progress Bar Active (Green Line) */}
                    <div 
                        className="absolute top-7 right-10 h-1 bg-emerald-500 z-0 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                        style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 20px)` }}
                    ></div>

                    <div className="relative z-10 flex justify-between items-start">
                        {steps.map((step, index) => (
                            <div key={step.key} className="flex flex-col items-center w-24">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 transition-all duration-500 shadow-sm
                                    ${index <= currentStep 
                                        ? (index === currentStep && paper.status === 'rejected' ? 'bg-red-500 border-red-500 text-white' : 'bg-emerald-500 border-emerald-500 text-white')
                                        : 'bg-white border-gray-100 text-gray-300'}`}>
                                    {index <= currentStep ? step.icon : index + 1}
                                </div>
                                <div className="mt-4 text-center">
                                    <p className={`text-xs font-black transition-colors ${index <= currentStep ? 'text-blue-950' : 'text-gray-400'}`}>
                                        {step.label}
                                    </p>
                                    {index === currentStep && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full mt-1 inline-block">أنت هنا</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-blue-950 mb-4 border-b border-gray-50 pb-4">الملخص العلمي</h3>
                        <p className="leading-loose text-gray-600 font-medium text-justify">{paper.abstract || 'لا يوجد ملخص متاح.'}</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-blue-950 mb-4 border-b border-gray-50 pb-4">المؤلفون المشاركون</h3>
                        <div className="space-y-4">
                            {paper.coauthors && paper.coauthors.length > 0 ? paper.coauthors.map((author, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{author.full_name}</h4>
                                        <p className="text-xs text-gray-500">{author.email} {author.affiliation ? ` - ${author.affiliation}` : ''}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-gray-400 text-sm italic p-4 bg-gray-50 rounded-2xl">لا يوجد مؤلفون مشاركون مسجلون لهذا البحث.</div>
                            )}
                        </div>
                    </div>

                    {paper.assignments && paper.assignments.some(a => a.review) && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-r-4 border-r-indigo-500">
                            <h3 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-3">
                                <span>📜</span> تقارير وملاحظات المحكمين
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

                    {/* Status History Audit Trail */}
                    {paper.status_history && paper.status_history.length > 0 && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-3 font-['Cairo']">
                                <span className="text-xl">🕒</span> سجل حركات البحث
                            </h3>
                            <div className="relative space-y-8 before:absolute before:right-[1.45rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                {paper.status_history.map((h, i) => (
                                    <div key={i} className="relative pr-12">
                                        <div className="absolute right-4 top-1 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-white z-10"></div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-black text-blue-950">{getStatusInfo(h.status).text}</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{new Date(h.created_at).toLocaleString('ar-EG')}</span>
                                            </div>
                                            {h.note && (
                                                <p className="mt-1 text-xs text-gray-500 font-medium bg-gray-50 p-2 rounded-lg inline-block">{h.note}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-950 p-8 rounded-3xl text-white shadow-xl shadow-blue-900/20">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">الحالة الحالية</p>
                                <span className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 w-fit ${statusInfo.color.replace('bg-', 'bg-white/10 ').replace('text-', 'text-white ')}`}>
                                    <span>{statusInfo.icon}</span>
                                    {statusInfo.text}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">المؤتمر المستهدف</p>
                                <p className="font-bold mt-1 text-blue-200">{paper.conference?.title || 'غير محدد'}</p>
                            </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">الكلمات المفتاحية</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {paper.keywords ? paper.keywords.split(',').map((k, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs">{k.trim()}</span>
                                    )) : <span className="text-xs opacity-40 italic">لا توجد كلمات مفتاحية</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {paper.file_path && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                            <div className="text-5xl mb-4">📄</div>
                            <h4 className="font-bold text-gray-900 line-clamp-1 mb-6 text-sm" dir="ltr">{paper.file_name}</h4>
                            <a href={`/storage_file/${paper.file_path}`} target="_blank" download className="block w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition">تحميل نسخة البحث</a>
                        </div>
                    )}

                    {/* Session Info */}
                    {paper.status === 'scheduled' && paper.sessions && paper.sessions.length > 0 && (
                        <div className="bg-emerald-900 p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/20">
                            <h4 className="font-black mb-4 flex items-center gap-2">
                                <span>📅</span> تفاصيل العرض في المؤتمر
                            </h4>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-60">الجلسة</span>
                                    <span>{paper.sessions[0].title}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-60">القاعة</span>
                                    <span>{paper.sessions[0].room}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-60">التوقيت</span>
                                    <span dir="ltr">{new Date(paper.sessions[0].start_time).toLocaleString('ar-EG')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-60">نوع العرض</span>
                                    <span className="bg-white/20 px-2 py-0.5 rounded uppercase text-[10px]">{paper.presentation_type || 'Oral'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Camera Ready Upload */}
                    {['accepted', 'scheduled'].includes(paper.status) && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-dashed border-emerald-200">
                            <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
                                <span>📤</span> رفع النسخة النهائية (Camera Ready)
                            </h4>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                مبروك! بحثك مقبول. يرجى رفع النسخة النهائية للبحث بعد إجراء أي تعديلات طفيفة طلبها المحكمون.
                            </p>
                            <form onSubmit={handleCameraReadyUpload} className="space-y-4">
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={(e) => setCameraReadyFile(e.target.files[0])}
                                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className="w-full py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                                >
                                    {uploading ? 'جاري الرفع...' : 'رفع النسخة النهائية'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
