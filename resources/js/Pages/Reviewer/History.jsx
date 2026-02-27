import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewerHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/api/reviewer/history');
                setHistory(response.data);
            } catch (err) {
                console.error('Error fetching reviewer history:', err);
                setError('حدث خطأ أثناء تحميل سجل التحكيم.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getDecisionLabel = (decision) => {
        switch (decision) {
            case 'accept': return { text: 'قبول', color: 'bg-emerald-50 text-emerald-600' };
            case 'minor_revision': return { text: 'تعديلات طفيفة', color: 'bg-blue-50 text-blue-600' };
            case 'major_revision': return { text: 'تعديلات جوهرية', color: 'bg-amber-50 text-amber-600' };
            case 'reject': return { text: 'رفض', color: 'bg-red-50 text-red-600' };
            default: return { text: decision, color: 'bg-gray-50 text-gray-600' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 bg-red-50 text-red-800 rounded-2xl border border-red-100">{error}</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-black text-indigo-950 font-['Cairo']">سجل الأبحاث المحكمة</h1>
                <p className="text-gray-500 text-sm mt-1">تاريخ الأبحاث التي تم استكمال تحكيمها بنجاح.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-right">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-indigo-50/30 border-b border-gray-100">
                            <th className="p-6 text-sm font-black text-indigo-950">عنوان البحث والجهة</th>
                            <th className="p-6 text-sm font-black text-indigo-950 text-center">القرار</th>
                            <th className="p-6 text-sm font-black text-indigo-950 text-center">النتيجة</th>
                            <th className="p-6 text-sm font-black text-indigo-950">تاريخ التحكيم</th>
                            <th className="p-6 text-sm font-black text-indigo-950 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-10 text-center text-gray-400 font-bold">
                                    لا توجد أبحاث مكتملة في السجل حالياً.
                                </td>
                            </tr>
                        ) : (
                            history.map((assignment) => {
                                const decision = getDecisionLabel(assignment.review?.decision);
                                return (
                                    <tr key={assignment.id} className="hover:bg-gray-50 transition">
                                        <td className="p-6">
                                            <div className="font-bold text-indigo-950">{assignment.paper?.title}</div>
                                            <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                                                {assignment.paper?.conference?.title}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${decision.color}`}>
                                                {decision.text}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center font-black text-indigo-600">
                                            {assignment.review?.overall_score ? `${assignment.review.overall_score}/10` : '-'}
                                        </td>
                                        <td className="p-6 text-sm text-gray-400 font-medium">
                                            {assignment.updated_at ? new Date(assignment.updated_at).toLocaleDateString('ar-EG') : '-'}
                                        </td>
                                        <td className="p-6 text-center">
                                            <button className="p-3 bg-gray-50 text-indigo-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition inline-flex items-center justify-center" title="عرض التقييم">👁️</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
