import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        originality_score: 5,
        methodology_score: 5,
        results_score: 5,
        clarity_score: 5,
        comments_to_author: '',
        comments_to_editor: '',
        recommendation: 'accept'
    });

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                // We use the same assignments endpoint or a specific one
                const response = await axios.get('/api/reviewer/assignments');
                const found = response.data.find(a => a.id === parseInt(id));
                setAssignment(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`/api/reviewer/assignments/${id}/review`, form);
            alert('تم إرسال تقييمك العلمي بنجاح. شكراً لك.');
            navigate('/reviewer/assignments');
        } catch (err) {
            alert('فشل إرسال التقييم: ' + (err.response?.data?.message || 'خطأ غير معروف'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold">جاري تحميل النموذج...</div>;
    if (!assignment) return <div className="p-20 text-center text-red-500 font-bold">المهمة غير موجودة</div>;

    const ScoreInput = ({ label, name }) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-black text-indigo-900">{label}</label>
                <span className="text-xl font-black text-indigo-600">{form[name]} / 10</span>
            </div>
            <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={form[name]}
                onChange={e => setForm({...form, [name]: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                <span>ضعيف جداً</span>
                <span>ممتاز</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in slide-in-from-bottom duration-700">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-indigo-950 mb-2 font-['Cairo']">نموذج التقييم العلمي</h1>
                <p className="text-gray-500 font-medium">Paper ID: #{assignment.paper_id} - <span className="text-indigo-600 italic">"{assignment.paper?.title}"</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <ScoreInput label="الأصالة والابتكار (Originality)" name="originality_score" />
                    <ScoreInput label="المنهجية العلمية (Methodology)" name="methodology_score" />
                    <ScoreInput label="النتائج والمناقشة (Results)" name="results_score" />
                    <ScoreInput label="وضوح الكتابة واللغة (Clarity)" name="clarity_score" />
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <div>
                        <label className="block text-sm font-black text-indigo-950 mb-4">تعليقات موجهة للباحث (تظهر للباحث)</label>
                        <textarea 
                            required
                            className="w-full p-5 rounded-2xl border border-gray-200 focus:border-indigo-500 outline-none h-40 text-sm font-medium"
                            placeholder="اكتب ملاحظاتك العلمية التي تساعد الباحث على تطوير ورقتة..."
                            value={form.comments_to_author}
                            onChange={e => setForm({...form, comments_to_author: e.target.value})}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-indigo-950 mb-4">ملاحظات سرية للمحرر (لا تظهر للباحث)</label>
                        <textarea 
                            className="w-full p-5 rounded-2xl border border-gray-200 focus:border-indigo-500 outline-none h-32 text-sm font-medium bg-indigo-50/30"
                            placeholder="اكتب انطباعك الخاص للجنة العلمية..."
                            value={form.comments_to_editor}
                            onChange={e => setForm({...form, comments_to_editor: e.target.value})}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-indigo-950 mb-4">التوصية النهائية (Recommendation)</label>
                        <select 
                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none font-bold text-gray-700"
                            value={form.recommendation}
                            onChange={e => setForm({...form, recommendation: e.target.value})}
                        >
                            <option value="accept">✔ قبول النشر (Accept)</option>
                            <option value="minor_revision">🟡 تعديلات طفيفة (Minor Revision)</option>
                            <option value="major_revision">🟠 تعديلات جوهرية (Major Revision)</option>
                            <option value="reject">❌ رفض البحث (Reject)</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {submitting ? 'جاري الإرسال...' : 'إرسال التقييم النهائي'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate('/reviewer/assignments')}
                        className="px-10 py-5 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}
