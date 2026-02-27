import React from 'react';

export default function ReviewerCommittees() {
    const committees = [
        { id: 1, name: 'اللجنة العلمية العليا - مؤتمر الذكاء الاصطناعي', role: 'رئيس قسم الذكاء الاصطناعي', tasks: 12, status: 'نشط' },
        { id: 2, name: 'لجنة مراجعة أخلاقيات البحث العلمي', role: 'عضو محكم', tasks: 5, status: 'نشط' },
        { id: 3, name: 'لجنة النشر والتحرير الدولية', role: 'مستشار تقني', tasks: 0, status: 'غير نشط' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-black text-indigo-950 font-['Cairo']">لجان المؤتمرات</h1>
                <p className="text-gray-500 text-sm mt-1">عضويات اللجان العلمية المسندة إليك ومستوى مشاركتك فيها.</p>
            </div>

            <div className="grid gap-6">
                {committees.map((committee) => (
                    <div key={committee.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">🏛️</div>
                            <div>
                                <h3 className="text-xl font-bold text-indigo-950 mb-1">{committee.name}</h3>
                                <div className="flex gap-4 text-xs font-black uppercase tracking-widest">
                                    <span className="text-indigo-600 font-bold">{committee.role}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-400">{committee.tasks} بحث تحت إشرافك</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${committee.status === 'نشط' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                {committee.status}
                            </span>
                            <button className="px-6 py-2 bg-indigo-950 text-white rounded-xl font-bold hover:bg-indigo-800 transition shadow-lg shadow-indigo-100">
                                عرض المهام
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
