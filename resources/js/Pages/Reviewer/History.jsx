import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReviewerHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);

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
                                            <button onClick={() => setSelectedReview(assignment)} className="p-3 bg-gray-50 text-indigo-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition inline-flex items-center justify-center" title="عرض التقييم">👁️</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Review Details Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-indigo-950 mb-1">تفاصيل التقييم</h3>
                                <p className="text-sm text-gray-500 font-bold">{selectedReview.paper?.title}</p>
                            </div>
                            <button onClick={() => setSelectedReview(null)} className="text-gray-400 hover:text-red-500 transition">✕</button>
                        </div>
                        
                        <div className="space-y-6 text-right">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <div className="text-xs text-gray-500 font-bold mb-1">القرار</div>
                                    <div className="font-black text-indigo-900">{getDecisionLabel(selectedReview.review?.decision).text}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <div className="text-xs text-gray-500 font-bold mb-1">الدرجة النهائية</div>
                                    <div className="font-black text-indigo-600">{selectedReview.review?.overall_score}/10</div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-50">
                                <h4 className="text-sm font-black text-indigo-900 mb-4">تفصيل الدرجات</h4>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-bold">الأصالة</span>
                                        <span className="font-black text-indigo-900">{selectedReview.review?.originality_score}/10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-bold">المنهجية</span>
                                        <span className="font-black text-indigo-900">{selectedReview.review?.methodology_score}/10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-bold">النتائج</span>
                                        <span className="font-black text-indigo-900">{selectedReview.review?.results_score}/10</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-bold">الوضوح</span>
                                        <span className="font-black text-indigo-900">{selectedReview.review?.clarity_score}/10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-black text-indigo-900 mb-2">ملاحظات للمؤلف</h4>
                                    <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 leading-relaxed min-h-[100px]">
                                        {selectedReview.review?.comments_to_author || 'لا توجد ملاحظات.'}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 mb-2">ملاحظات سرية للمحرر</h4>
                                    <div className="bg-amber-50 p-4 rounded-2xl text-sm text-amber-900 leading-relaxed min-h-[100px] border border-amber-100">
                                        {selectedReview.review?.comments_to_editor || 'لا توجد ملاحظات سرية.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
