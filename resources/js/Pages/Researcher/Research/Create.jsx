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
        paper_files: [],
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
            const newFiles = Array.from(e.target.files);
            setFormData({ ...formData, paper_files: [...formData.paper_files, ...newFiles] });
            // Reset input value so the same file can be selected again if removed
            e.target.value = null;
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleCoauthorChange = (index, field, value) => {
        const newCoauthors = [...formData.coauthors];
        newCoauthors[index][field] = value;
        setFormData({ ...formData, coauthors: newCoauthors });
    };

    const removeFile = (indexToRemove) => {
        const updatedFiles = formData.paper_files.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, paper_files: updatedFiles });
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
        
        if (formData.paper_files && formData.paper_files.length > 0) {
            formData.paper_files.forEach((file, index) => {
                data.append(`paper_files[${index}]`, file);
            });
        } else {
            setError("يرجى إرفاق ملف البحث الرئيسي على الأقل.");
            setLoading(false);
            return;
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
        <div className="max-w-7xl mx-auto space-y-2 pb-20 px-6">
            {success && (
                <div className="p-8 bg-emerald-50 text-emerald-800 font-bold rounded-4xl border-2 border-emerald-100 flex items-center gap-6 shadow-sm mb-4">
                    <span className="text-3xl">🎉</span> {success}
                </div>
            )}
            {error && (
                <div className="p-8 bg-red-50 text-red-800 font-bold rounded-4xl border-2 border-red-100 flex items-center gap-6 shadow-sm whitespace-pre-line mb-4">
                    <span className="text-3xl">⚠️</span> {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <div className="lg:col-span-2 space-y-4">
                    <div className="pr-2 pb-2">
                        <h1 className="text-xl font-black text-blue-950 font-['Cairo'] mb-1">
                            تقديم بحث جديد
                        </h1>
                        <p className="text-gray-400 font-bold text-xs">
                            خطوتك الأولى للمشاركة في المجتمع العلمي العالمي
                        </p>
                    </div>
                    {/* Basic Info */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">عنوان البحث</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleChange} required
                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-xl"
                                placeholder="أدخل عنوان البحث الكامل هنا..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">الملخص (Abstract)</label>
                            <textarea
                                name="abstract" value={formData.abstract} onChange={handleChange} required rows="5"
                                className="w-full px-8 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-medium leading-relaxed text-lg"
                                placeholder="اكتب ملخص البحث هنا (بحد أدنى 250 كلمة)..."
                            ></textarea>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">الكلمات المفتاحية (Keywords)</label>
                                <input
                                    type="text" name="keywords" value={formData.keywords} onChange={handleChange} required
                                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-medium text-lg"
                                    placeholder="افصل بين الكلمات بفاصلة (،)"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">مجال البحث (Track)</label>
                                <input 
                                    type="text" name="track" value={formData.track} onChange={handleChange}
                                    className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                                    placeholder="مثال: هندسة البرمجيات، الذكاء الاصطناعي..."
                                />
                            </div>
                        </div>
                    </div>



                    {/* File Upload */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest block pr-2">ملفات البحث (PDF/DOCX/ZIP/CSV)</label>
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">الملف الأول يعتبر هو البحث الرئيسي</span>
                        </div>
                        <div className="relative group">
                            <input 
                                type="file" multiple name="paper_files" onChange={handleChange} accept=".pdf,.doc,.docx,.zip,.rar,.xls,.xlsx,.csv"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-blue-50 border-2 border-dashed border-blue-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 group-hover:bg-blue-100 group-hover:border-blue-400 transition-all">
                                <div className="text-5xl group-hover:scale-110 transition-transform">📂</div>
                                <div className="text-center">
                                    <p className="font-bold text-blue-900 text-xl">اضغط هنا لرفع الملاحظات أو اسحب الملفات</p>
                                    <p className="text-blue-500 text-sm mt-1">يمكنك تحديد عدة ملفات دفعة واحدة</p>
                                </div>
                            </div>
                        </div>
                        
                        {formData.paper_files.length > 0 && (
                            <div className="mt-8 space-y-4">
                                {formData.paper_files.map((file, index) => (
                                    <div key={index} className="px-6 py-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-between border border-emerald-100 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">📄</span>
                                            <div>
                                                <p className="font-bold text-base leading-none">{file.name}</p>
                                                <p className="text-xs font-bold text-emerald-600/70 mt-2 uppercase tracking-widest">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB {index === 0 && "— الملف الرئيسي"}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile(index)} 
                                            className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white text-red-500 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coauthors */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-blue-950">المؤلفون المشاركون</h3>
                            <button type="button" onClick={addCoauthor} className="px-6 py-3 bg-blue-50 text-blue-600 font-black rounded-xl hover:bg-blue-100 transition text-sm">
                                + إضافة مؤلف
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.coauthors.map((author, index) => (
                                <div key={index} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative group">
                                    {index > 0 && (
                                        <button 
                                            type="button" onClick={() => removeCoauthor(index)}
                                            className="absolute top-6 left-6 text-red-500 hover:scale-110 transition text-xl"
                                        >🗑️</button>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input 
                                            placeholder="الاسم الكامل" value={author.full_name}
                                            onChange={(e) => handleCoauthorChange(index, 'full_name', e.target.value)}
                                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 font-bold text-lg"
                                        />
                                        <input 
                                            placeholder="البريد الإلكتروني" value={author.email}
                                            onChange={(e) => handleCoauthorChange(index, 'email', e.target.value)}
                                            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 text-lg"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Template Preview Section */}
                    <div className="bg-white p-4 rounded-3xl shadow-lg border border-blue-50 flex flex-col items-center gap-3 group cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all" onClick={() => window.open('/images/template-preview.jpg', '_blank')}>
                        <div className="text-center space-y-1">
                            <h2 className="text-sm font-black text-blue-950 font-['Cairo'] flex items-center justify-center gap-1">
                                <span className="text-blue-500 text-base">📄</span> شكل قالب البحث المعتمد
                            </h2>
                            <p className="text-gray-500 font-bold text-[10px] leading-relaxed px-2">
                                هذا نموذج يوضح الشكل المعتمد للصفحة الأولى من البحث. يرجى الالتزام بنفس التنسيق والهيكلية الموضحة في الصورة عند كتابة ورفع بحثك لتجنب رفضه في مرحلة الفحص الأولي من قبل اللجان.
                            </p>
                        </div>
                        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 relative">
                            <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-white font-black text-sm bg-blue-900/80 px-4 py-2 rounded-xl shadow-md">🔍 اضغط للتكبير</span>
                            </div>
                            <img src="/images/template-preview.jpg" alt="Template Preview" className="w-full h-auto object-cover max-h-[400px] object-top group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    <div className="rounded-[3rem] text-white shadow-2xl shadow-blue-900/40 overflow-hidden"
                         style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)' }}>
                        <div className="p-12">
                            <h3 className="text-2xl font-bold mb-10 border-b border-white/10 pb-6 text-teal-400">إعدادات النشر</h3>
                            
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] opacity-60 block pr-2">المؤتمر المستهدف</label>
                                    <select 
                                        name="conf_id"
                                        value={formData.conf_id} onChange={handleChange}
                                        className="w-full px-8 py-5 bg-white/5 rounded-3xl outline-none focus:bg-white/10 border-2 border-white/10 font-bold text-lg text-white"
                                    >
                                        <option className="text-blue-950" value="">اختر المؤتمر...</option>
                                        {conferences.map(conf => (
                                            <option key={conf.id} className="text-blue-950" value={conf.id}>{conf.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-6 pt-4">
                                    <label className="flex items-center gap-6 cursor-pointer group">
                                        <input type="checkbox" required className="w-8 h-8 rounded-xl border-2 border-white/20 bg-transparent checked:bg-teal-500 transition-all cursor-pointer" />
                                        <span className="text-sm font-medium leading-relaxed group-hover:text-teal-300 transition">أقر بأن هذا البحث أصيل ولم يتم نشره مسبقاً في أي جهة أخرى.</span>
                                    </label>
                                    <label className="flex items-center gap-6 cursor-pointer group">
                                        <input type="checkbox" required className="w-8 h-8 rounded-xl border-2 border-white/20 bg-transparent checked:bg-teal-500 transition-all cursor-pointer" />
                                        <span className="text-sm font-medium leading-relaxed group-hover:text-teal-300 transition">أوافق على شروط وقوانين النشر في جامعة إقليم سبأ.</span>
                                    </label>
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full mt-12 py-6 bg-teal-500 hover:bg-teal-400 text-blue-950 font-black text-xl rounded-[2rem] shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-6 group active:scale-95"
                            >
                                <span>{loading ? 'جاري الإرسال...' : 'إرسال البحث الآن'}</span>
                                <span className="text-2xl group-hover:translate-x-[-8px] transition-transform">⬅️</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-8 rounded-4xl border border-blue-100 shadow-xl"
                         style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
                        <h4 className="font-black text-blue-900 mb-4 flex items-center gap-2 text-lg">
                            <span className="text-2xl">💡</span> تعليمات هامة:
                        </h4>
                        <ul className="text-sm text-blue-800/80 space-y-4 font-bold">
                            <li className="flex gap-3 items-start">
                                <span className="text-teal-500 mt-1">•</span>
                                <span>تأكد من مراجعة القواعد اللغوية والإملائية بدقة قبل الإرسال.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="text-teal-500 mt-1">•</span>
                                <span>يجب ألا يتجاوز الملخص 500 كلمة كحد أقصى.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="text-teal-500 mt-1">•</span>
                                <span>احرص على ذكر كافة المؤلفين المشاركين وبياناتهم بدقة تامة.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
}
