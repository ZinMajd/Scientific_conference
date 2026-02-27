import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResearchRevision() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [paper, setPaper] = useState(null);
    const [formData, setFormData] = useState({
        summary_of_changes: '',
        revised_file: null,
        response_letter: null
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const response = await axios.get(`/api/papers/${id}`);
                setPaper(response.data);
            } catch (err) {
                console.error("Error fetching paper:", err);
                setError("فشل تحميل بيانات البحث");
            } finally {
                setFetching(false);
            }
        };
        fetchPaper();
    }, [id]);

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        data.append('revised_file', formData.revised_file);
        data.append('response_letter', formData.response_letter);
        data.append('summary_of_changes', formData.summary_of_changes);

        try {
            await axios.post(`/api/papers/${id}/revision`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess("تم تقديم التعديلات بنجاح! سيتم مراجعتها من قبل اللجنة العلمية.");
            setTimeout(() => navigate('/researcher/research'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "فشل تقديم التعديلات");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-20 font-bold text-gray-400">جاري التحميل...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">تقديم التعديلات المقترحة</h1>
                <p className="text-gray-500 font-medium mt-2">يرجى رفع النسخة المعدلة من البحث مع خطاب الرد على ملاحظات المحكمين</p>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 items-start shadow-sm">
                <span className="text-2xl">📝</span>
                <div>
                    <h4 className="font-black text-amber-900">ملاحظة هامة:</h4>
                    <p className="text-sm text-amber-800 font-medium">يجب أن تتضمن النسخة المعدلة كافة التصحيحات المطلوبة، ويجب توضيح كيفية الرد على كل ملاحظة في خطاب الرد المرفق.</p>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm border border-emerald-100">{success}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
                <div className="space-y-4">
                    <label className="block text-sm font-black text-gray-700">عنوان البحث</label>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-blue-900">{paper?.title}</div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-black text-gray-700">ملخص التغييرات</label>
                    <textarea 
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none h-32 font-medium"
                        placeholder="اكتب ملخصاً موجزاً للتعديلات التي أجريتها بناءً على ملاحظات المحكمين..."
                        value={formData.summary_of_changes}
                        onChange={(e) => setFormData({...formData, summary_of_changes: e.target.value})}
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700">النسخة المعدلة (PDF/DOCX)</label>
                        <div className="relative group">
                            <input 
                                type="file" name="revised_file" onChange={handleFileChange} required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center group-hover:border-blue-400 transition bg-gray-50/50">
                                <span className="text-3xl block mb-2">📄</span>
                                <span className="text-xs font-bold text-gray-500">{formData.revised_file ? formData.revised_file.name : "اختر ملف البحث المعدل"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700">خطاب الرد (Response Letter)</label>
                        <div className="relative group">
                            <input 
                                type="file" name="response_letter" onChange={handleFileChange} required
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center group-hover:border-blue-400 transition bg-gray-50/50">
                                <span className="text-3xl block mb-2">✉️</span>
                                <span className="text-xs font-bold text-gray-500">{formData.response_letter ? formData.response_letter.name : "اختر ملف خطاب الرد"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                        type="submit" disabled={loading}
                        className="flex-1 py-5 bg-blue-950 text-white font-black rounded-3xl shadow-xl hover:bg-blue-900 transition flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                        <span>إرسال التعديلات للمراجعة</span>
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 bg-gray-100 text-gray-700 font-black rounded-3xl hover:bg-gray-200 transition">إلغاء</button>
                </div>
            </form>
        </div>
    );
}
