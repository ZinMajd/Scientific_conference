import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerCompleted() {
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                const response = await axios.get('/api/reviewer/assignments?status=completed');
                setCompleted(response.data);
            } catch (err) {
                console.error('Error fetching completed research:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompleted();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">الأبحاث المكتملة</h1>
                <p className="text-gray-500 font-medium">الأبحاث التي انتهيت من تحكيمها بنجاح</p>
            </div>

            <div className="grid gap-8">
                {completed.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                        <div className="text-5xl mb-4">📂</div>
                        <h3 className="text-xl font-bold text-gray-400">لا توجد أبحاث مكتملة حالياً</h3>
                    </div>
                ) : (
                    completed.map((task) => (
                        <div key={task.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group border-r-8 border-r-emerald-500">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-black text-indigo-950 group-hover:text-emerald-600 transition leading-tight">{task.paper?.title}</h3>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500 font-medium bg-gray-50 px-4 py-1.5 rounded-full">
                                            <span>👤</span> الباحث: {task.paper?.author?.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-1.5 rounded-full">
                                            <span>⭐</span> النتيجة: {task.overall_score}/10
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-fit">
                                    <Link to={`/reviewer/history`} className="px-8 py-4 bg-indigo-50 text-indigo-900 font-black rounded-2xl hover:bg-indigo-100 transition flex items-center justify-center gap-2">
                                        عرض التفاصيل
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
