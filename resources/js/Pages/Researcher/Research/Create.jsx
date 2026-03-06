import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResearchCreate() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const preselectedConfId = searchParams.get('confId') || "";

    const [conferences, setConferences] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        abstract: "",
        keywords: "",
        conf_id: preselectedConfId,
        track: "",
        paper_file: null,
        coauthors: [{ full_name: "", email: "", affiliation: "" }],
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Accept: "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        };

        setLoading(true);
        axios
            .get("/api/conferences", config)
            .then((response) => {
                console.log("Conferences response:", response.data);
                const confs = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setConferences(confs);
                
                // Explicitly set conf_id if preselectedConfId is provided and exists in confs
                if (preselectedConfId && confs.some(c => String(c.id) === String(preselectedConfId))) {
                    console.log("Pre-selecting conference:", preselectedConfId);
                    setFormData(prev => ({ ...prev, conf_id: preselectedConfId }));
                }

                if (confs.length === 0) {
                    setError("لا يوجد مؤتمرات متاحة للتقديم حالياً. يرجى التأكد من حالة المؤتمرات في النظام.");
                }
            })
            .catch((err) => {
                console.error("Fetch conferences error:", err);
                setError(`فشل في تحميل المؤتمرات: ${err.response?.data?.message || err.message}`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleCoauthorChange = (index, field, value) => {
        const newCoauthors = [...formData.coauthors];
        newCoauthors[index][field] = value;
        setFormData({ ...formData, coauthors: newCoauthors });
    };

    const addCoauthor = () => {
        setFormData({
            ...formData,
            coauthors: [
                ...formData.coauthors,
                { full_name: "", email: "", affiliation: "" },
            ],
        });
    };

    const removeCoauthor = (index) => {
        const newCoauthors = formData.coauthors.filter((_, i) => i !== index);
        setFormData({ ...formData, coauthors: newCoauthors });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const data = new FormData();
        data.append("title", formData.title);
        data.append("abstract", formData.abstract);
        data.append("keywords", formData.keywords);
        data.append("conf_id", formData.conf_id);
        data.append("track", formData.track);
        if (formData.paper_file) {
            data.append("paper_file", formData.paper_file);
        }

        // Filter out empty coauthors to avoid validation errors if the user left them blank
        const validCoauthors = formData.coauthors.filter(author => author.full_name.trim() !== "" || author.email.trim() !== "");

        validCoauthors.forEach((author, index) => {
            data.append(`coauthors[${index}][full_name]`, author.full_name);
            data.append(`coauthors[${index}][email]`, author.email);
            data.append(`coauthors[${index}][affiliation]`, author.affiliation || "");
        });

        try {
            console.log("Submitting paper with file:", formData.paper_file);
            const token = localStorage.getItem("token");
            const response = await axios.post("/api/papers", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            setSuccess(
                `تم تقديم البحث بنجاح! رقم المتابعة الخاص بك هو: ${response.data.tracking_number}`,
            );
            setTimeout(() => {
                navigate("/researcher/research");
            }, 3000);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 422) {
                const errorData = err.response.data.errors;
                const errorMessages = Object.values(errorData)
                    .flat()
                    .join("\n");
                setError("يرجى التحقق من المدخلات التالية:\n" + errorMessages);
            } else if (err.response) {
                setError(
                    `خطأ من الخادم: ${err.response.status} - ${err.response.data.message || err.response.statusText}`,
                );
            } else {
                setError(`خطأ غير متوقع: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">
                        تقديم بحث جديد
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        خطوتك الأولى للمشاركة في المجتمع العلمي العالمي
                    </p>
                </div>
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl shadow-xl shadow-blue-600/30">
                    📜
                </div>
            </div>

            {success && (
                <div className="p-8 bg-emerald-50 text-emerald-800 font-bold rounded-4xl border-2 border-emerald-100 flex items-center gap-6 shadow-sm">
                    <span className="text-3xl">🎉</span> {success}
                </div>
            )}
            {error && (
                <div className="p-8 bg-red-50 text-red-800 font-bold rounded-4xl border-2 border-red-100 flex items-center gap-6 shadow-sm whitespace-pre-line">
                    <span className="text-3xl">⚠️</span> {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">
                                عنوان البحث
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                                placeholder="أدخل عنوان البحث الكامل هنا..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">
                                الملخص (Abstract)
                            </label>
                            <textarea
                                name="abstract"
                                value={formData.abstract}
                                onChange={handleChange}
                                required
                                rows="8"
                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-medium leading-relaxed"
                                placeholder="اكتب ملخص البحث هنا (بحد أدنى 250 كلمة)..."
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">
                                الكلمات المفتاحية (Keywords)
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                required
                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-medium"
                                placeholder="افصل بين الكلمات بفاصلة (،)"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">مجال البحث (Track)</label>
                        <input 
                            type="text" name="track" value={formData.track} onChange={handleChange}
                            className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-bold"
                            placeholder="مثال: هندسة البرمجيات، الذكاء الاصطناعي..."
                        />
                    </div>

                    {/* File Upload */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">ملف البحث (PDF/DOCX)</label>
                        <div className="relative group">
                            <input 
                                type="file" name="paper_file" onChange={handleChange} required accept=".pdf,.doc,.docx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 group-hover:bg-blue-100 group-hover:border-blue-400 transition-all">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-4xl group-hover:scale-110 transition-transform">
                                    📂
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-blue-900 text-lg">اضغط هنا لرفع ملف البحث</p>
                                    <p className="text-blue-500 text-sm mt-1">أو قم بسحب وإسقاط الملف هنا</p>
                                </div>
                                {formData.paper_file && (
                                    <div className="mt-4 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm animate-in fade-in">
                                        ✅ {formData.paper_file.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coauthors */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-blue-950">المؤلفون المشاركون</h3>
                            <button type="button" onClick={addCoauthor} className="px-6 py-2 bg-blue-50 text-blue-600 font-black rounded-xl hover:bg-blue-100 transition text-sm">
                                + إضافة مؤلف
                            </button>
                        </div>

                        <div className="space-y-8">
                            {formData.coauthors.map((author, index) => (
                                <div key={index} className="p-8 bg-gray-50 rounded-4xl border border-gray-100 relative group animate-in slide-in-from-right-4">
                                    {index > 0 && (
                                        <button 
                                            type="button" onClick={() => removeCoauthor(index)}
                                            className="absolute top-6 left-6 text-red-500 hover:scale-110 transition"
                                        >🗑️</button>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input 
                                            placeholder="الاسم الكامل"
                                            value={author.full_name}
                                            onChange={(e) => handleCoauthorChange(index, 'full_name', e.target.value)}
                                            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                                        />
                                        <input 
                                            placeholder="البريد الإلكتروني"
                                            value={author.email}
                                            onChange={(e) => handleCoauthorChange(index, 'email', e.target.value)}
                                            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-blue-950 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/30">
                        <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-4">إعدادات النشر</h3>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">المؤتمر المستهدف</label>
                                <select 
                                    name="conf_id"
                                    value={formData.conf_id} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/10 rounded-2xl outline-none focus:bg-white/20 border border-white/10 font-bold"
                                >
                                    <option className="text-blue-950" value="">اختر المؤتمر...</option>
                                    {conferences.map(conf => (
                                        <option key={conf.id} className="text-blue-950" value={conf.id}>{conf.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4 pt-6">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="checkbox" required className="w-6 h-6 rounded-lg border-2 border-white/20 bg-transparent checked:bg-blue-500" />
                                    <span className="text-xs font-medium leading-relaxed group-hover:text-blue-300 transition">أقر بأن هذا البحث أصيل ولم يتم نشره مسبقاً في أي جهة أخرى.</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <input type="checkbox" required className="w-6 h-6 rounded-lg border-2 border-white/20 bg-transparent checked:bg-blue-500" />
                                    <span className="text-xs font-medium leading-relaxed group-hover:text-blue-300 transition">أوافق على شروط وقوانين النشر في جامعة إقليم سبأ.</span>
                                </label>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-4 group"
                        >
                            <span>{loading ? 'جاري الإرسال...' : 'إرسال البحث الآن'}</span>
                            <span className="group-hover:translate-x-[-5px] transition-transform">⬅️</span>
                        </button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-4xl border border-white/10">
                        <h4 className="font-black text-amber-900 mb-2">
                            تعليمات هامة:
                        </h4>
                        <ul className="text-xs text-amber-800 space-y-3 font-medium">
                            <li className="flex gap-2">
                                <span>•</span> تأكد من مراجعة القواعد اللغوية.
                            </li>
                            <li className="flex gap-2">
                                <span>•</span> يجب ألا يتجاوز الملخص 500 كلمة.
                            </li>
                            <li className="flex gap-2">
                                <span>•</span> احرص على ذكر كافة المؤلفين
                                المشاركين بدقة.
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
}
