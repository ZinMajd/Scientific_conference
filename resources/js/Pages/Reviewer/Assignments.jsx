import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get('/api/reviewer/assignments');
                setAssignments(response.data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    const handleDownload = (filePath, fileName) => {
        if (!filePath) {
            alert('الملف غير متوفر حالياً');
            return;
        }
        const link = document.createElement('a');
        link.href = `/storage_file/${filePath}`;
        link.setAttribute('download', fileName || 'paper.pdf');
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
                    <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">الأبحاث المسندة للتحكيم</h1>
                    <p className="text-gray-500 font-medium">مراجعة وتقييم الأوراق العلمية المسندة إليك من اللجنة</p>
                </div>
                <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">المهام النشطة</button>
                    <Link to="/reviewer/history" className="px-6 py-2 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition">سجل الأبحاث المحكمة</Link>
                </div>
            </div>

            <div className="grid gap-8">
                {assignments.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-gray-400">لا توجد أبحاث جديدة بانتظار تحكيمك</h3>
                    </div>
                ) : (
                    assignments.map((task) => (
                        <div key={task.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group border-r-8 border-r-indigo-600">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-black text-indigo-950 group-hover:text-indigo-600 transition leading-tight">{task.paper?.title}</h3>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 px-4 py-1.5 rounded-full">
                                            <span>👤</span> الباحث: {task.paper?.author?.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-1.5 rounded-full">
                                            <span>⏰</span> آخر موعد: {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-EG') : 'غير محدد'}
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-900 font-bold bg-indigo-50 px-4 py-1.5 rounded-full">
                                            <span>🏛️</span> {task.paper?.conference?.title}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-fit">
                                    <button 
                                        onClick={() => handleDownload(task.paper?.file_path, task.paper?.file_name)}
                                        className="px-6 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                                    >
                                        <span>📥</span> تحميل ملف البحث
                                    </button>
                                    <Link to={`/reviewer/form/${task.id}`} className="px-8 py-4 bg-indigo-950 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-900 transition flex items-center justify-center gap-2">
                                        <span>🖋️</span> نموذج التحكيم
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-indigo-100 overflow-hidden relative group">
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-indigo-950">دليل معايير التحكيم</h3>
                        <p className="text-gray-500 text-sm font-medium">يرجى مراجعة المعايير العلمية المعتمدة من قبل الجامعة قبل البدء في التقييم.</p>
                        <button className="text-indigo-600 font-black text-sm mt-4 hover:underline">عرض الدليل الكامل ➔</button>
                    </div>
                    <div className="text-6xl opacity-10 group-hover:opacity-20 transition group-hover:scale-110">📚</div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 -mr-16 -mt-16 rounded-full"></div>
            </div>
        </div>
    );
}
