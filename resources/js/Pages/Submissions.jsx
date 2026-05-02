import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Submissions() {
    // Dropdown states
    const [editorialOpen, setEditorialOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20" dir="ltr">
            {/* Header */}
            <div className="border-b border-gray-100 py-4 px-6 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <div className="w-12 h-12 flex items-center justify-center text-white text-3xl font-black rounded-sm" style={{ background: PRUSSIAN_DARK }}>US</div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">UNIVERSITY OF SABA REGION</h1>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scientific Conference Management System</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
                        {/* Stay within journal section */}
                    </div>
                </div>
            </div>

            {/* Secondary Nav with Dropdowns */}
            <div className="text-white py-3 px-6 shadow-md relative z-40" style={{ background: PRUSSIAN }}>
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-xs font-black uppercase tracking-wider items-center">
                    <Link to="/archive" className="transition hover:text-[#40E0D0]" style={{ color: 'white' }}>الأرشيف</Link>
                    
                    <Link to="/submissions" className="transition" style={{ color: TURQUOISE }}>إرشادات التقديم</Link>
                    <Link to="/topical-collection" className="transition" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>مجموعة المواضيع</Link>

                    {/* Editorial Dropdown */}
                    <div className="relative" onMouseEnter={() => setEditorialOpen(true)} onMouseLeave={() => setEditorialOpen(false)}>
                        <button className="flex items-center gap-1 transition uppercase" style={{ color: 'white' }} onMouseEnter={(e) => e.currentTarget.style.color = TURQUOISE} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                            هيئة التحرير <span className="text-[8px]">▼</span>
                        </button>
                        {editorialOpen && (
                            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 py-2 mt-0 z-50">
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Editorial Board</Link>
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Advisory Board</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/announcements" className="transition" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>الإعلانات</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">إرشادات التقديم</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <h1 className="text-4xl font-black text-slate-900 mb-10 italic">إرشادات تقديم الأبحاث</h1>

                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-sm mb-12 shadow-sm">
                    <h3 className="text-emerald-900 font-black text-lg mb-4">هل لديك حساب بالفعل؟</h3>
                    <p className="text-sm text-emerald-800 leading-relaxed mb-6">
                        يتطلب تقديم الأبحاث في نظام جامعة إقليم سبأ تسجيل الدخول أولاً. إذا كنت مسجلاً مسبقاً، يمكنك البدء بالتقديم مباشرة.
                    </p>
                    <Link to="/login" className="inline-block px-8 py-3 font-black text-xs rounded-sm transition shadow-lg uppercase tracking-widest hover:scale-105" style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>تسجيل الدخول للبدء</Link>
                    
                    <hr className="my-8 border-emerald-100" />
                    
                    <h3 className="text-emerald-900 font-black text-lg mb-4">ليس لديك حساب؟</h3>
                    <p className="text-sm text-emerald-800 leading-relaxed mb-6">
                        يجب على جميع الباحثين إنشاء حساب جديد للمشاركة في المؤتمرات العلمية وتتبع حالة أبحاثهم.
                    </p>
                    <Link to="/register" className="font-black text-sm uppercase tracking-wider hover:underline underline-offset-4 decoration-2" style={{ color: PRUSSIAN }}>إنشاء حساب جديد الآن</Link>
                </div>

                <section className="mb-16">
                    <h2 className="text-2xl font-black text-slate-800 mb-8 border-b-2 border-slate-800 w-fit pb-1">قائمة التحقق قبل الإرسال</h2>
                    <p className="text-sm text-gray-500 mb-8">كجزء من عملية الإرسال، يُطلب من المؤلفين التحقق من امتثال أبحاثهم لجميع العناصر التالية:</p>
                    
                    <ul className="space-y-6">
                        {[
                            { title: "الأصالة", desc: "أن يكون البحث أصيلاً ولم يسبق نشره في أي مجلة علمية أو مؤتمر آخر." },
                            { title: "التنسيق", desc: "أن يكون الملف بصيغة (Microsoft Word) أو (PDF) وفقاً للقالب المعتمد في الجامعة." },
                            { title: "التحكيم الأعمى", desc: "يجب إزالة أسماء المؤلفين وأي إشارات للهوية من داخل متن البحث لضمان نزاهة عملية التحكيم الأعمى." },
                            { title: "المراجع", desc: "الالتزام بنظام التوثيق المعتمد (APA أو IEEE) مع توفير روابط (URL) للمراجع المتاحة إلكترونياً." },
                            { title: "اللغة", desc: "أن يكون البحث مكتوباً بلغة سليمة (العربية أو الإنجليزية) وخالياً من الأخطاء اللغوية والنحوية." }
                        ].map((item, idx) => (
                            <li key={idx} className="flex gap-4 items-start group">
                                <span className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-700 flex items-center justify-center rounded-full text-xs font-black">✓</span>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 mb-1">{item.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl font-black text-slate-800 mb-8 border-b-2 border-slate-800 w-fit pb-1">دليل المؤلفين (Author Guidelines)</h2>
                    <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
                        <div className="p-6 bg-gray-50 border-r-4 border-slate-800">
                            <p className="italic leading-relaxed">
                                تلتزم جامعة إقليم سبأ بمعايير النشر العلمي الرصينة، وتخضع جميع الأبحاث المقدمة لعملية تحكيم دقيقة من قبل خبراء متخصصين في المجال.
                            </p>
                        </div>
                        
                        <h4 className="text-slate-800 font-black text-lg">خطوات تقديم البحث:</h4>
                        <ol className="list-decimal list-inside space-y-4">
                            <li><strong>رفع البحث:</strong> يتم رفع النسخة الأولية للبحث بدون أسماء المؤلفين (Blind Version).</li>
                            <li><strong>الفحص الأولي:</strong> تخضع الأبحاث لفحص أولي للتأكد من مطابقتها للتخصص وتنسيق المؤتمر.</li>
                            <li><strong>التحكيم العلمي:</strong> يتم إرسال البحث إلى اثنين من المحكمين على الأقل بشكل سري.</li>
                            <li><strong>القرار النهائي:</strong> يتم إبلاغ الباحث بقرار اللجنة (قبول، قبول مع تعديلات، أو رفض).</li>
                        </ol>

                        <h4 className="text-slate-800 font-black text-lg">سياسة الوصول المفتوح:</h4>
                        <p>
                            تتبع المنصة سياسة الوصول الحر (Open Access)، مما يتيح للأبحاث المقبولة فرصة أكبر للانتشار والاستشهاد العلمي العالمي.
                        </p>
                    </div>
                </section>

                <section className="mb-12 p-10 text-white rounded-sm shadow-xl relative overflow-hidden" style={{ background: PRUSSIAN_DARK }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] -mr-16 -mt-16"></div>
                    <h2 className="text-2xl font-black mb-8 relative z-10">تحميل قوالب الأبحاث</h2>
                    <div className="flex flex-wrap gap-6 relative z-10">
                        <button onClick={(e) => {e.preventDefault(); window.open('#', '_blank');}} className="px-8 py-4 bg-white text-slate-900 font-black text-sm rounded-sm transition flex items-center gap-3 shadow-lg hover:scale-105" style={{ color: PRUSSIAN_DARK }}>
                            <span className="text-xl">📄</span> تحميل قالب (Word)
                        </button>
                        <button onClick={(e) => {e.preventDefault(); window.open('#', '_blank');}} className="px-8 py-4 bg-white/10 text-white font-black text-sm rounded-sm hover:bg-white/20 transition border border-white/20 flex items-center gap-3 hover:scale-105">
                            <span className="text-xl">🛠️</span> تحميل قالب (LaTeX)
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
