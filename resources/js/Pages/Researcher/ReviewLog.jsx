import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResearcherReviewLog() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/researcher/reviews');
                setReviews(response.data);
            } catch (err) {
                console.error('Error fetching researcher reviews:', err);
                setError('حدث خطأ أثناء تحميل سجل التحكيم.');
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 bg-red-50 text-red-800 rounded-2xl border border-red-100">{error}</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">سجل التحكيم</h1>
                <p className="text-gray-500 font-medium">سجل بجميع الملاحظات والنتائج الواردة على أبحاثك العلمية</p>
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="bg-white p-20 text-center rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold text-lg text-center">لا توجد سجلات تحكيم متاحة حالياً.</p>
                        <p className="text-gray-400 text-sm mt-2 text-center text-center">تظهر النتائج هنا بمجرد استكمال تحكيم أبحاثك وتقديم المحكمين لتقاريرهم.</p>
                    </div>
                ) : (
                    reviews.map((review) => {
                        const decision = getDecisionLabel(review.decision);
                        return (
                            <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-r-4 border-r-blue-500">
                                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-blue-950">{review.paper_title}</h3>
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{review.conference}</p>
                                    </div>
                                    <div className="flex gap-3 h-fit">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 ${decision.color}`}>
                                            {decision.text}
                                        </span>
                                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black flex items-center gap-2">
                                            النتيجة: {review.score}/10
                                        </span>
                                        <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black flex items-center gap-2">
                                            📅 {review.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-2xl">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">ملاحظات المحكم:</h4>
                                    <p className="text-gray-600 leading-loose whitespace-pre-line italic">
                                        "{review.comments || 'لم يتم تقديم ملاحظات نصية من قبل المحكم.'}"
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
