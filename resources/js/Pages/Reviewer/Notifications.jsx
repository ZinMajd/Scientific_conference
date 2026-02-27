import React from 'react';

export default function ReviewerNotifications() {
    const notifications = [
        { id: 1, title: 'تكليف بحث جديد', body: 'تم إسناد بحث جديد إليك للمراجعة: "تأثير الذكاء الاصطناعي في التعليم"', date: 'منذ ساعتين', type: 'new' },
        { id: 2, title: 'موعد نهائي يقترب', body: 'سينتهي الموعد النهائي للبحث المسند إليك خلال 24 ساعة', date: 'منذ 5 ساعات', type: 'warning' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-indigo-950 font-['Cairo']">الإشعارات</h1>
                <p className="text-gray-500 font-medium">آخر التنبيهات والرسائل المتعلقة بعمليات التحكيم</p>
            </div>

            <div className="grid gap-4">
                {notifications.map((note) => (
                    <div key={note.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-6 hover:shadow-md transition">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${note.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {note.type === 'warning' ? '⚠️' : '🔔'}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-indigo-950">{note.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{note.body}</p>
                            <span className="text-[10px] text-gray-400 font-black mt-2 block uppercase">{note.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
