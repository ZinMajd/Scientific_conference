import React, { useState } from 'react';

const faqData = [
    {
        question: "كيف يمكنني تقديم ورقة بحثية لمؤتمر؟",
        answer: "يجب عليك أولاً إنشاء حساب باحث، ثم التوجه إلى صفحة 'المؤتمرات' واختيار المؤتمر المطلوب، والنقر على 'تسجيل ورقة بحثية' لرفع ملف البحث بصيغة PDF."
    },
    {
        question: "ما هو نظام التحكيم المتبع في المنصة؟",
        answer: "نعتمد نظام التحكيم المزدوج التعمية (Double-Blind Peer Review)، حيث يتم إخفاء هوية الباحث عن المحكمين، وإخفاء هوية المحكمين عن الباحث لضمان أعلى مستويات الحيادية."
    },
    {
        question: "كيف أعرف حالة البحث الخاص بي؟",
        answer: "يمكنك متابعة حالة البحث من خلال لوحة تحكم الباحث (أبحاثي)، حيث ستظهر لك الحالات المختلفة (قيد الفحص، قيد التحكيم، مقبول، مرفوض، أو يتطلب تعديلات)."
    },
    {
        question: "هل يمكنني إجراء تعديلات على البحث بعد تقديمه؟",
        answer: "لا يمكن التعديل بعد التقديم النهائي إلا إذا طلب المحرر ذلك (Revision Required)، حيث سيتم فتح إمكانية رفع نسخة معدلة لك."
    },
    {
        question: "متى يتم نشر البحث في الأرشيف العلمي؟",
        answer: "يتم نشر البحث بعد قبوله نهائياً ومروره بمرحلة الإنتاج والتنسيق. يتم جدولته للنشر التلقائي بعد استيفاء كافة المتطلبات الفنية."
    },
    {
        question: "كيف أحصل على شهادة المشاركة؟",
        answer: "بعد انتهاء المؤتمر وقبول بحثك أو حضورك، ستظهر لك أيقونة تحميل الشهادة في لوحة التحكم الخاصة بك في قسم 'الشهادات'."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20">
            {/* Header */}
            <div className="py-20 text-center bg-white border-b border-gray-100">
                <h1 className="text-4xl font-black text-indigo-950 mb-4">الأسئلة الشائعة</h1>
                <p className="text-gray-500 font-bold">كل ما تحتاج معرفته عن استخدام نظام المؤتمرات العلمية</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-16 space-y-4">
                {faqData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <button 
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            className="w-full p-6 text-right flex justify-between items-center group"
                        >
                            <span className={`font-black text-lg transition ${activeIndex === index ? 'text-indigo-600' : 'text-indigo-950'}`}>
                                {item.question}
                            </span>
                            <span className={`text-2xl transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-indigo-600' : 'text-gray-300'}`}>
                                {activeIndex === index ? '−' : '+'}
                            </span>
                        </button>
                        
                        <div 
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="text-gray-600 leading-relaxed font-medium border-t border-gray-50 pt-4">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Support Call to Action */}
            <div className="max-w-3xl mx-auto px-6 mt-20">
                <div className="bg-indigo-950 rounded-3xl p-10 text-center text-white shadow-2xl">
                    <h3 className="text-2xl font-black mb-4">لم تجد إجابة لسؤالك؟</h3>
                    <p className="text-indigo-200 mb-8 font-bold">فريق الدعم الفني متواجد لمساعدتك في أي وقت.</p>
                    <a 
                        href="mailto:support@sabauni.edu.ye" 
                        className="inline-block px-10 py-4 bg-teal-400 text-indigo-950 font-black rounded-xl hover:bg-teal-300 transition"
                    >
                        تواصل مع الدعم الفني
                    </a>
                </div>
            </div>
        </div>
    );
}
