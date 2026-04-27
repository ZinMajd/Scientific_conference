import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-white font-['Cairo'] pb-20">
            {/* Hero Section */}
            <div className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #40E0D0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-in slide-in-from-bottom duration-700">عن نظام جامعة إقليم سبأ للمؤتمرات العلمية</h1>
                    <p className="text-xl text-teal-400 font-bold leading-relaxed">
                        منصة رقمية متكاملة تهدف إلى تعزيز البحث العلمي وتسهيل إدارة المؤتمرات العلمية وفق المعايير الدولية.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20 space-y-8">
                {[
                    { title: 'الرؤية', text: 'أن نكون المنصة الرائدة في إدارة المعرفة العلمية وتسهيل الوصول للأبحاث المبتكرة في المنطقة، من خلال توظيف أحدث التقنيات الرقمية لخدمة المجتمع الأكاديمي.', color: 'border-teal-400' },
                    { title: 'الرسالة', text: 'توفير بيئة تقنية احترافية تربط بين الباحثين والمحكمين والمؤسسات الأكاديمية بكل شفافية وجودة، والارتقاء بمستوى النشر العلمي في جامعة إقليم سبأ.', color: 'border-indigo-400' },
                    { title: 'الأهداف', text: 'أتمتة دورة حياة البحث العلمي بالكامل، من التقديم حتى النشر النهائي الموثق، وتسهيل عملية التواصل بين كافة أطراف العملية البحثية وضمان دقة النتائج.', color: 'border-amber-400' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-4 transition-all duration-300">
                        <div className="text-right flex-1">
                            <h3 className="text-3xl font-black text-indigo-950 mb-4">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto px-6 mt-24 space-y-20">
                <section className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100">
                    <h2 className="text-3xl font-black text-indigo-950 mb-6">نظام تحكيم احترافي (Double-Blind)</h2>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6 font-medium">
                        نلتزم في منصتنا بأعلى معايير النزاهة العلمية، حيث يعتمد النظام آلية "التحكيم المزدوج التعمية" لضمان حيادية التقييم وجودة المحتوى العلمي المنشور.
                    </p>
                    <ul className="space-y-4 font-bold text-indigo-900">
                        <li className="flex items-center gap-3">
                            <span className="text-teal-500">✓</span> إخفاء هوية الباحثين عن المحكمين تلقائياً.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-teal-500">✓</span> تقارير تقييم مفصلة ومعايير دقيقة.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-teal-500">✓</span> متابعة دورة التعديلات بين الباحث والمحرر.
                        </li>
                    </ul>
                </section>

                <section className="bg-indigo-950 text-white p-12 rounded-[3rem] shadow-2xl">
                    <h2 className="text-3xl font-black mb-6">إدارة النشر العلمي والإنتاج</h2>
                    <p className="text-teal-100 leading-relaxed text-lg mb-8 font-medium">
                        يوفر النظام مكتب إنتاج ونشر متكامل، يضمن خروج الأبحاث بتنسيق احترافي موحد، مع منحها معرفات رقمية دولية وتوثيقها في الأرشيف العلمي للجامعة.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                            <p className="font-black text-sm">توثيق DOI</p>
                        </div>
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                            <p className="font-black text-sm">نشر مجدول</p>
                        </div>
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                            <p className="font-black text-sm">أرشيف رقمي</p>
                        </div>
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                            <p className="font-black text-sm">شهادات مشاركة</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* University Logo Section */}
            <div className="mt-32 py-20 bg-gray-50 border-y border-gray-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <img src="/images/saba_logo.gif" alt="Logo" className="w-24 h-24 mx-auto mb-8 grayscale hover:grayscale-0 transition duration-500" />
                    <h3 className="text-xl font-black text-gray-800 mb-2">جامعة إقليم سبأ</h3>
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">نحو غدٍ مشرق بالمعرفة</p>
                </div>
            </div>
        </div>
    );
}
