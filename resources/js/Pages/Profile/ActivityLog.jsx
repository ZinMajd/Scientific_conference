import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ActivityLog() {
    const [activities, setActivities] = useState([
        { id: 1, action: 'تسجيل دخول', description: 'تم تسجيل الدخول إلى النظام', time: 'منذ ساعة', icon: '🔑', color: 'text-blue-600 bg-blue-50' },
        { id: 2, action: 'تقديم بحث', description: 'تم تقديم الورقة البحثية "الذكاء الاصطناعي في اليمن"', time: 'أمس', icon: '📄', color: 'text-emerald-600 bg-emerald-50' },
        { id: 3, action: 'تغيير الملف الشخصي', description: 'تعديل بيانات المسمى الوظيفي', time: 'منذ يومين', icon: '👤', color: 'text-amber-600 bg-amber-50' }
    ]);
    const [loading, setLoading] = useState(false);

    // In a real app, fetch from API
    // useEffect(() => { ... }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">سجل الأنشطة</h1>
                    <p className="text-gray-500 text-sm mt-1">تتبع تحركاتك وإجراءاتك البرمجية داخل النظام</p>
                </div>
                <button className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition uppercase tracking-widest">
                    تحميل التقرير الكامل
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {activities.map((activity) => (
                        <div key={activity.id} className="p-8 hover:bg-gray-50/50 transition-all flex items-start gap-6 group">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm ${activity.color} group-hover:scale-110 transition-transform`}>
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-900 transition">{activity.action}</h3>
                                    <span className="text-xs font-bold text-gray-400">{activity.time}</span>
                                </div>
                                <p className="text-gray-500 mt-2 leading-relaxed">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
                    <button className="text-sm font-bold text-gray-400 hover:text-blue-600 transition">عرض المزيد من السجلات...</button>
                </div>
            </div>

            <div className="px-10 py-6 bg-blue-950 rounded-4xl text-white flex items-center justify-between shadow-2xl shadow-blue-900/40">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">🛡️</div>
                    <p className="text-sm font-medium">سجل الأنشطة محمي ومشفر، ويظهر لك أنت فقط لضمان الخصوصية.</p>
                </div>
            </div>
        </div>
    );
}
