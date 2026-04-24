import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/reviewer/assignments');
            setAssignments(response.data);
        } catch (err) {
            console.error('Error fetching assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleAccept = async (id) => {
        try {
            await axios.post(`/api/reviewer/assignments/${id}/accept`);
            alert('تم قبول المهمة بنجاح. يمكنك الآن البدء في التحكيم.');
            fetchAssignments();
        } catch (err) {
            alert('فشل قبول المهمة');
        }
    };

    const handleDecline = async (id) => {
        const reason = prompt('يرجى ذكر سبب الاعتذار (اختياري):');
        try {
            await axios.post(`/api/reviewer/assignments/${id}/decline`, { reason });
            alert('تم تسجيل اعتذارك. شكراً لك.');
            fetchAssignments();
        } catch (err) {
            alert('فشل تسجيل الاعتذار');
        }
    };

    const handleDownload = (paper) => {
        const filePath = paper.blind_file_path || paper.file_path; // Prioritize blind version
        if (!filePath) {
            alert('الملف غير متوفر حالياً');
            return;
        }
        const link = document.createElement('a');
        link.href = `/storage_file/${filePath}`;
        link.setAttribute('download', paper.file_name || 'paper.pdf');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">تحكيم الأبحاث العلمية</h1>
                    <p className="text-gray-500 font-medium italic">تحذير: هذا نظام تحكيم أعمى (Blind Review) - هوية الباحثين مخفية تماماً لضمان النزاهة.</p>
                </div>
                <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">المهام والطلبات</button>
                    <Link to="/reviewer/history" className="px-6 py-2 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition">السجل</Link>
                </div>
            </div>

            <div className="grid gap-8">
                {assignments.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-gray-400">لا توجد طلبات تحكيم حالياً</h3>
                    </div>
                ) : (
                    assignments.map((task) => (
                        <div key={task.id} className={`bg-white p-10 rounded-[2.5rem] border shadow-sm transition-all group border-r-8 ${task.status === 'assigned' ? 'border-amber-400' : 'border-indigo-600'}`}>
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${task.status === 'assigned' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {task.status === 'assigned' ? 'طلب جديد (بانتظار قبولك)' : 'مهمة نشطة (قيد التحكيم)'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-indigo-950 leading-tight">Paper ID: #{task.paper?.id} - {task.paper?.title}</h3>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-gray-400 font-medium">
                                            <span>👤</span> الباحث: <span className="blur-[5px] select-none opacity-50">{task.paper?.author?.full_name}</span> 
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-1.5 rounded-full">
                                            <span>⏰</span> موعد التسليم: {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-EG') : 'غير محدد'}
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-900 font-bold bg-indigo-50 px-4 py-1.5 rounded-full">
                                            <span>🏛️</span> {task.paper?.conference?.title}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-fit">
                                    {task.status === 'assigned' ? (
                                        <>
                                            <button 
                                                onClick={() => handleAccept(task.id)}
                                                className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition"
                                            >
                                                ✔ قبول الدعوة
                                            </button>
                                            <button 
                                                onClick={() => handleDecline(task.id)}
                                                className="px-8 py-4 bg-rose-50 text-rose-600 font-black rounded-2xl border border-rose-100 hover:bg-rose-100 transition"
                                            >
                                                ❌ اعتذار
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleDownload(task.paper)}
                                                className="px-6 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                                            >
                                                <span>📥</span> تحميل النسخة العمياء
                                            </button>
                                            <Link to={`/reviewer/form/${task.id}`} className="px-8 py-4 bg-indigo-950 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-900 transition flex items-center justify-center gap-2">
                                                <span>🖋️</span> نموذج التقييم العلمي
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
