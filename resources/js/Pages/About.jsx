import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-white font-['Cairo'] pb-20" dir="rtl">
            {/* Hero Section */}
            <div className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #40E0D0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-4">عن نظام جامعة إقليم سبأ للمؤتمرات العلمية</h1>
                    <p className="text-base text-teal-400 font-bold leading-relaxed max-w-2xl mx-auto">
                        موقع رقمي متكامل يهدف إلى تعزيز البحث العلمي وتسهيل إدارة المؤتمرات العلمية وفق المعايير الدولية.
                    </p>
                </div>
            </div>

            {/* Vision / Mission / Goals Cards */}
            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20 space-y-4">
                {[
                    { title: 'الرؤية', text: 'أن نكون الموقع الرائد في إدارة المعرفة العلمية وتسهيل الوصول للأبحاث المبتكرة في المنطقة، من خلال توظيف أحدث التقنيات الرقمية لخدمة المجتمع الأكاديمي.', accent: '#40E0D0' },
                    { title: 'الرسالة', text: 'توفير بيئة تقنية احترافية تربط بين الباحثين والمحكمين والمؤسسات الأكاديمية بكل شفافية وجودة، والارتقاء بمستوى النشر العلمي في جامعة إقليم سبأ.', accent: '#40E0D0' },
                    { title: 'الأهداف', text: 'أتمتة دورة حياة البحث العلمي بالكامل، من التقديم حتى النشر النهائي الموثق، وتسهيل عملية التواصل بين كافة أطراف العملية البحثية وضمان دقة النتائج.', accent: '#40E0D0' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm border-r-4" style={{ borderRightColor: item.accent }}>
                        <h3 className="text-lg font-black mb-2" style={{ color: '#003153' }}>{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
                    </div>
                ))}
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto px-6 mt-12 space-y-6">
                <section className="bg-gray-50 p-8 border border-gray-100 rounded-sm">
                    <h2 className="text-xl font-black mb-3" style={{ color: '#003153' }}>نظام تحكيم احترافي (Double-Blind)</h2>
                    <div className="w-12 h-0.5 mb-4 rounded-none" style={{ background: '#40E0D0' }}></div>
                    <p className="text-gray-600 leading-relaxed text-sm mb-5">
                        نلتزم في موقعنا بأعلى معايير النزاهة العلمية، حيث يعتمد النظام آلية &quot;التحكيم المزدوج التعمية&quot; لضمان حيادية التقييم وجودة المحتوى العلمي المنشور.
                    </p>
                    <ul className="space-y-3 text-sm font-bold" style={{ color: '#003153' }}>
                        <li className="flex items-center gap-3">
                            <span style={{ color: '#40E0D0' }}>✓</span> إخفاء هوية الباحثين عن المحكمين تلقائياً.
                        </li>
                        <li className="flex items-center gap-3">
                            <span style={{ color: '#40E0D0' }}>✓</span> تقارير تقييم مفصلة ومعايير دقيقة.
                        </li>
                        <li className="flex items-center gap-3">
                            <span style={{ color: '#40E0D0' }}>✓</span> متابعة دورة التعديلات بين الباحث والمحرر.
                        </li>
                    </ul>
                </section>

                <section className="p-8 rounded-sm shadow-md" style={{ background: 'linear-gradient(135deg, #001a2e 0%, #003153 100%)' }}>
                    <h2 className="text-xl font-black text-white mb-3">إدارة النشر العلمي والإنتاج</h2>
                    <div className="w-12 h-0.5 mb-4 rounded-none" style={{ background: '#40E0D0' }}></div>
                    <p className="text-teal-100 leading-relaxed text-sm mb-6">
                        يوفر النظام مكتب إنتاج ونشر متكامل، يضمن خروج الأبحاث بتنسيق احترافي موحد، مع منحها معرفات رقمية دولية وتوثيقها في الأرشيف العلمي للجامعة.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['توثيق DOI', 'نشر مجدول', 'أرشيف رقمي', 'شهادات مشاركة'].map((label, i) => (
                            <div key={i} className="p-4 rounded-sm border border-white/20 text-center" style={{ background: 'rgba(64,224,208,0.08)' }}>
                                <p className="font-black text-sm text-white">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>


        </div>
    );
}
