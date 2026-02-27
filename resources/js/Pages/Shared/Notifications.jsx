import React from 'react';

export default function Notifications() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">مركز التنبيهات</h1>
                <p className="text-gray-500 font-medium">ابقَ على اطلاع بآخر التحديثات، التعليقات، وقرارات اللجان</p>
            </div>
            
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="p-10 flex items-start gap-8 hover:bg-gray-50 transition group cursor-pointer">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">🔔</div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition">تحديث جديد في حالة البحث</h4>
                                <span className="text-xs font-bold text-gray-400">منذ ساعتين</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium">تم انتقال بحثك "الذكاء الاصطناعي في اليمن" إلى مرحلة التحكيم العلمي. يمكنك تتبع التقدم من لوحة التحكم.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
