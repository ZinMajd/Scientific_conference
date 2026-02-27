import React from 'react';

export default function ReviewerGuidelines() {
    const guidelines = [
        {
            title: 'الأصالة والابتكار',
            desc: 'يجب أن يقدم البحث إضافة حقيقية للمعرفة العلمية في مجاله، ولا يقتصر على تكرار نتائج سابقة.',
            icon: '💡'
        },
        {
            title: 'المنهجية العلمية',
            desc: 'يجب التأكد من وضوح منهجية البحث، وصحة استخدام الأدوات الإحصائية أو التحليلية.',
            icon: '🔬'
        },
        {
            title: 'الأمانة العلمية',
            desc: 'التحقق من توثيق كافة المصادر والمراجع بدقة، وخلو البحث من أي شكل من أشكال الانتحال.',
            icon: '🛡️'
        },
        {
            title: 'جودة العرض ولغة البحث',
            desc: 'وضوح المصطلحات، وسلامة اللغة، وترابط الأفكار، والتزام الباحث بقوالب النشر المعتمدة.',
            icon: '✍️'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-indigo-900 border-r-4 border-indigo-400 p-8 rounded-4xl text-white shadow-xl">
                <h1 className="text-3xl font-black mb-3">دليل التحكيم العلمي</h1>
                <p className="text-indigo-200 leading-relaxed">تلتزم جامعة إقليم سبأ بأعلى المعايير المهنية في تحكيم الأبحاث العلمية لضمان جودة المخرجات الأكاديمية.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {guidelines.map((g, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {g.icon}
                        </div>
                        <h3 className="text-xl font-bold text-indigo-950 mb-3">{g.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-4xl">
                <h4 className="text-amber-900 font-bold mb-4 flex items-center gap-2">
                    <span>⚠️</span> ملاحظات قانونية وأخلاقية
                </h4>
                <ul className="space-y-3 text-sm text-amber-800 font-medium">
                    <li>• يجب الحفاظ على سرية البحث المحكم وعدم استخدامه بأي شكل قبل نشره.</li>
                    <li>• يمنع التحكيم في حال وجود تضارب مصالح مع الباحثين.</li>
                    <li>• يجب تقديم الملاحظات بشكل بناء يهدف لرفع سوية البحث.</li>
                </ul>
            </div>
        </div>
    );
}
