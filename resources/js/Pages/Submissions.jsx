import { useState } from 'react';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#105d82';
const PRUSSIAN_DARK = '#0a4a68';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Submissions() {

    return (
        <div className="min-h-screen bg-white font-['Cairo'] pb-20" dir="rtl">
            <style>{`
                .hover-turquoise:hover { color: #40E0D0 !important; }
                .text-turquoise { color: #40E0D0 !important; }
                .text-prussian { color: #003153 !important; }
                .hover-ocean:hover { color: #0096c7 !important; }
            `}</style>

            {/* Header */}
            <div className="border-b border-gray-100 py-4 px-6 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <img src="/images/university_logo.gif" alt="جامعة إقليم سبأ" className="w-12 h-12 object-contain" />
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">جامعة إقليم سبأ</h1>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">نظام إدارة المؤتمرات العلمية</p>
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
                    <Link to="/archive" className="transition text-white hover-turquoise">الأرشيف</Link>
                    
                    <Link to="/submissions" className="transition text-turquoise">إرشادات التقديم</Link>
                    <Link to="/topical-collection" className="transition text-white hover-turquoise">مجموعة المواضيع</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">إرشادات التقديم</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12 text-gray-700">
                <h1 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-gray-200">إرشادات تقديم الأبحاث</h1>
                
                {/* Two blank lines / empty spacing */}
                <div className="h-8"></div>

                <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm mb-12">
                    <h3 className="text-slate-800 font-bold text-base mb-4">هل لديك حساب بالفعل؟</h3>
                    <p className="text-sm leading-relaxed mb-6">
                        يتطلب تقديم الأبحاث في نظام جامعة إقليم سبأ تسجيل الدخول أولاً. إذا كنت مسجلاً مسبقاً، يمكنك البدء بالتقديم مباشرة.
                    </p>
                    <Link to="/login" className="inline-block px-6 py-2.5 font-bold text-sm rounded-sm transition bg-white border border-gray-300 hover:bg-gray-100 text-slate-800">تسجيل الدخول للبدء</Link>
                    
                    <hr className="my-8 border-gray-200" />
                    
                    <h3 className="text-slate-800 font-bold text-base mb-4">ليس لديك حساب؟</h3>
                    <p className="text-sm leading-relaxed mb-6">
                        يجب على جميع الباحثين إنشاء حساب جديد للمشاركة في المؤتمرات العلمية وتتبع حالة أبحاثهم.
                    </p>
                    <Link to="/register" className="font-bold text-sm text-[#005c99] hover:underline">إنشاء حساب جديد الآن</Link>
                </div>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">قائمة التحقق قبل الإرسال</h2>
                    <p className="text-sm mb-6">كجزء من عملية الإرسال، يُطلب من المؤلفين التحقق من امتثال أبحاثهم لجميع العناصر التالية:</p>
                    
                    <ul className="space-y-6">
                        {[
                            { title: "الأصالة", desc: "أن يكون البحث أصيلاً ولم يسبق نشره في أي مجلة علمية أو مؤتمر آخر." },
                            { title: "التنسيق", desc: "أن يكون الملف بصيغة (Microsoft Word) أو (PDF) وفقاً للقالب المعتمد في الجامعة." },
                            { title: "التحكيم الأعمى", desc: "يجب إزالة أسماء المؤلفين وأي إشارات للهوية من داخل متن البحث لضمان نزاهة عملية التحكيم الأعمى." },
                            { title: "المراجع", desc: "الالتزام بنظام التوثيق المعتمد (APA أو IEEE) مع توفير روابط (URL) للمراجع المتاحة إلكترونياً." },
                            { title: "اللغة", desc: "أن يكون البحث مكتوباً بلغة سليمة (العربية أو الإنجليزية) وخالياً من الأخطاء اللغوية والنحوية." }
                        ].map((item, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                                <span className="shrink-0 text-slate-400 mt-0.5">•</span>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                                    <p className="text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">دليل المؤلفين (Author Guidelines)</h2>
                    <div className="text-sm leading-relaxed space-y-6">
                        <div className="p-4 bg-gray-50 border-r-4 border-gray-300">
                            <p className="italic">
                                تلتزم جامعة إقليم سبأ بمعايير النشر العلمي الرصينة، وتخضع جميع الأبحاث المقدمة لعملية تحكيم دقيقة من قبل خبراء متخصصين في المجال.
                            </p>
                        </div>
                        
                        <h4 className="text-slate-800 font-bold text-base">خطوات تقديم البحث:</h4>
                        <ol className="list-decimal list-inside space-y-4">
                            <li><strong>رفع البحث:</strong> يتم رفع النسخة الأولية للبحث بدون أسماء المؤلفين (Blind Version).</li>
                            <li><strong>الفحص الأولي:</strong> تخضع الأبحاث لفحص أولي للتأكد من مطابقتها للتخصص وتنسيق المؤتمر.</li>
                            <li><strong>التحكيم العلمي:</strong> يتم إرسال البحث إلى اثنين من المحكمين على الأقل بشكل سري.</li>
                            <li><strong>القرار النهائي:</strong> يتم إبلاغ الباحث بقرار اللجنة (قبول، قبول مع تعديلات، أو رفض).</li>
                        </ol>

                        <h4 className="text-slate-800 font-bold text-base">سياسة الوصول المفتوح:</h4>
                        <p>
                            يتبع الموقع سياسة الوصول الحر (Open Access)، مما يتيح للأبحاث المقبولة فرصة أكبر للانتشار والاستشهاد العلمي العالمي.
                        </p>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">تحميل قالب البحث</h2>
                    <div className="flex flex-wrap gap-6">
                        <a href="/templates/research_template.doc" download className="px-6 py-3 bg-white border border-gray-300 text-slate-700 font-bold text-sm rounded-sm transition flex items-center gap-3 hover:bg-gray-50">
                            <span className="text-xl" role="img" aria-label="Word template">📄</span> تحميل قالب (Word)
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
