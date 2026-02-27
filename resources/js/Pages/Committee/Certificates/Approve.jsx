import React from 'react';

export default function CommitteeCertificatesApprove() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">اعتماد الشهادات</h1>
                <p className="text-gray-500 font-medium">مراجعة واعتماد الشهادات النهائية قبل إتاحتها للتحميل</p>
            </div>
            
            <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">لا توجد شهادات بانتظار الاعتماد حالياً.</p>
            </div>
        </div>
    );
}
