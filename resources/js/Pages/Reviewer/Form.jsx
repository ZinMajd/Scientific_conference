import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [assignment, setAssignment] = useState(null);

    const criteria = [
        { id: 'originality', label: 'الأصالة والابتكار', desc: 'مدى جدة الموضوع وإضافته العلمية' },
        { id: 'methodology', label: 'المنهجية العلمية', desc: 'سلامة المنهج المتبع ودقة الأدوات' },
        { id: 'quality', label: 'النتائج والتحليل', desc: 'دقة عرض النتائج وتفسيرها علمياً' },
        { id: 'presentation', label: 'الكتابة واللغة', desc: 'جودة الصياغة اللغوية والتنظيم' },
        { id: 'relevance', label: 'المراجع والمصادر', desc: 'حداثة المراجع ودقة التوثيق العلمي' }
    ];

    const [form, setForm] = useState({
        originality: 3,
        methodology: 3,
        quality: 3,
        presentation: 3,
        relevance: 3,
        comments_author: '',
        comments_chair: '',
        decision: 'minor_revision'
    });

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`/api/reviewer/assignments/${id}`);
                setAssignment(response.data);
            } catch (err) {
                console.error('Error fetching assignment details:', err);
                alert('حدث خطأ أثناء تحميل بيانات البحث');
                navigate('/reviewer/assignments');
            } finally {
                setFetching(false);
            }
        };
        fetchAssignment();
    }, [id, navigate]);

    const handleDownload = () => {
        if (!assignment?.paper?.file_path) {
            alert('الملف غير متوفر');
            return;
        }
        const link = document.createElement('a');
        link.href = `/api/papers/${assignment.paper.id}/download`;
        link.setAttribute('download', assignment.paper.file_name || 'paper.pdf');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const calculateOverallScore = () => {
        const scores = [form.originality, form.methodology, form.relevance, form.presentation, form.quality];
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return (avg * 2).toFixed(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`/api/reviewer/assignments/${id}/submit`, {
                ...form,
                overall_score: calculateOverallScore()
            });
            setSuccess(true);
        } catch (err) {
            console.error('Error submitting review:', err);
            alert('حدث خطأ أثناء إرسال التحكيم. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/reviewer/history');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg shadow-emerald-100">✅</div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-indigo-950 font-['Cairo']">تم إرسال التحكيم بنجاح</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">شكراً لمساهمتك العلمية القيمة. جاري توجيهك إلى سجل الأبحاث المحكمة...</p>
                </div>
                <button 
                    onClick={() => navigate('/reviewer/history')}
                    className="px-10 py-4 bg-indigo-950 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-900 transition"
                > الانتقال إلى سجل الأبحاث المحكمة </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">نموذج التحكيم</h1>
                    <p className="text-gray-500 mt-2 font-medium italic">يرجى توخي الدقة والموضوعية في التقييم</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <span className="text-xs font-black text-indigo-400">كود البحث: #{assignment?.paper?.id}</span>
                    <button 
                        onClick={handleDownload}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                    >📥 تحميل ملف البحث</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Research View */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                        <div className="flex items-center gap-4 text-indigo-600 mb-2">
                            <span className="text-2xl">📖</span>
                            <h3 className="text-xl font-bold">عرض البحث</h3>
                        </div>
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                            <h4 className="text-lg font-black text-indigo-950 mb-3">{assignment?.paper?.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                {assignment?.paper?.abstract}
                            </p>
                            <div className="flex gap-4 mt-6">
                                <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-black rounded-lg text-gray-400">الكلمات المفتاحية: {assignment?.paper?.keywords}</span>
                            </div>
                        </div>
                    </div>

                    {/* Scores Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <h3 className="text-xl font-black text-indigo-950 mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm">1</span>
                            التقييم العلمي (من 5)
                        </h3>
                        
                        <div className="space-y-8">
                            {criteria.map((item) => (
                                <div key={item.id} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{item.label}</h4>
                                            <p className="text-xs text-gray-400">{item.desc}</p>
                                        </div>
                                        <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{form[item.id]} / 5</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="5" 
                                        value={form[item.id]} 
                                        onChange={(e) => setForm({...form, [item.id]: parseInt(e.target.value)})}
                                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <h3 className="text-xl font-black text-indigo-950 mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm">2</span>
                            الملاحظات
                        </h3>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 block pr-2">ملاحظات للمؤلف (تظهر للباحث)</label>
                                <textarea 
                                    rows="6"
                                    value={form.comments_author}
                                    onChange={(e) => setForm({...form, comments_author: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    placeholder="اكتب ملاحظاتك النقدية والتطويرية للباحث هنا..."
                                    required
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 block pr-2">ملاحظات سرية للجنة العلمية (لا تظهر للباحث)</label>
                                <textarea 
                                    rows="4"
                                    value={form.comments_chair}
                                    onChange={(e) => setForm({...form, comments_chair: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                                    placeholder="أدخل أي ملاحظات إضافية ترغب في إطلاع اللجنة العلمية عليها حصراً..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Decision Box */}
                    <div className="bg-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/40">
                        <h3 className="text-lg font-bold mb-8 border-b border-white/10 pb-4">القرار</h3>
                        
                        <div className="space-y-4">
                            {[
                                { id: 'accept', label: 'قبول البحث كما هو', color: 'accent-emerald-500' },
                                { id: 'minor_revision', label: 'قبول بعد تعديلات طفيفة', color: 'accent-blue-400' },
                                { id: 'major_revision', label: 'تعديلات جوهرية وإعادة تحكيم', color: 'accent-amber-400' },
                                { id: 'reject', label: 'رفض البحث', color: 'accent-red-500' }
                            ].map((opt) => (
                                <label key={opt.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition cursor-pointer group">
                                    <input 
                                        type="radio" name="decision" 
                                        checked={form.decision === opt.id}
                                        onChange={() => setForm({...form, decision: opt.id})}
                                        className={`w-5 h-5 ${opt.color}`} 
                                    />
                                    <span className={`text-sm font-bold ${form.decision === opt.id ? 'text-white' : 'text-indigo-200'}`}>{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                            <span>إرسال التحكيم</span>
                        </button>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                        <h4 className="font-black text-amber-900 mb-2">تذكير:</h4>
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            بمجرد إرسال التقرير، لن تتمكن من تعديله. يرجى التأكد من كافة الملاحظات والدرجات الممنوحة قبل الضغط على زر الإرسال.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
