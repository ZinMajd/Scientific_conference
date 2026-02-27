import React from 'react';

export default function Certificates() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">الشهادات والوثائق</h1>
                <p className="text-gray-500 font-medium">تحميل شهادات الحضور، المشاركة، وخطابات القبول الرسمية</p>
            </div>
            
            <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-6">📜</div>
                <h3 className="text-xl font-bold text-gray-400">لا توجد شهادات متاحة حالياً</h3>
                <p className="text-gray-300 text-sm mt-2 max-w-sm mx-auto font-medium">يتم إصدار الشهادات تلقائياً بعد انتهاء فعاليات المؤتمر واعتمادها من قبل اللجنة العلمية.</p>
            </div>
        </div>
    );
}
