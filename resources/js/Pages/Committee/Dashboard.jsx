import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CommitteeDashboard() {
    const [stats, setStats] = useState({
        total_papers: 0,
        total_conferences: 0,
        total_reviewers: 0,
        total_attendees: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/committee/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching committee stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const mainStats = [
        { title: 'إجمالي الأبحاث', value: stats.total_papers, trend: '+12%', color: 'bg-blue-600', icon: '📄' },
        { title: 'المحكمين', value: stats.total_reviewers, trend: '+2', color: 'bg-indigo-600', icon: '⚖️' },
        { title: 'المؤتمرات', value: stats.total_conferences, trend: 'نشط', color: 'bg-emerald-500', icon: '🏛️' },
        { title: 'المسجلين', value: stats.total_attendees, trend: '+45', color: 'bg-amber-500', icon: '👥' }
    ];

    const recentActivities = [
        { id: 1, action: 'إسناد بحث جديد', details: 'تم إسناد "تأمين الشبكات" للمحكم د. صالح', time: '10:30 ص', type: 'إسناد' },
        { id: 2, action: 'توصية قبول', details: 'أوصى المحكم د. سحر بقبول بحث "الذكاء الاصطناعي"', time: '9:15 ص', type: 'نتيجة' },
        { id: 3, action: 'إنشاء جلسة', details: 'تمت جدولة جلسة "الأمن السيبراني" لليوم الثاني', time: 'أمس', type: 'تنظيم' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 mb-2 font-['Cairo']">تحليلات اللجنة العلمية</h1>
                    <p className="text-gray-500 font-medium">مرحباً بك مجدداً. إليك لمصة عامة عن أداء المؤتمرات والأبحاث حالياً.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/committee/conferences" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-2">
                        <span>➕</span> إدارة المؤتمرات
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition`}>
                                {stat.icon}
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-3xl font-black text-blue-950 mt-1">{stat.value}</h3>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 opacity-50"></div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-xl font-bold text-blue-950">آخر النشاطات الإدارية</h2>
                        <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">سجل العمليات</button>
                    </div>
                    <div className="p-8 space-y-8">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex gap-6 relative group">
                                <div className="w-1 bg-gray-50 absolute right-4.5 top-8 bottom-0 z-0"></div>
                                <div className={`w-10 h-10 rounded-xl shrink-0 z-10 flex items-center justify-center text-sm shadow-sm ${
                                    activity.type === 'إسناد' ? 'bg-blue-50 text-blue-600' : 
                                    activity.type === 'نتيجة' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {activity.type === 'إسناد' ? '🔗' : activity.type === 'نتيجة' ? '⚖️' : '🕒'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-blue-950 text-lg group-hover:text-blue-700 transition">{activity.action}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold">{activity.time}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{activity.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-6">
                    <div className="bg-blue-950 p-8 rounded-4xl text-white shadow-2xl shadow-blue-900/30">
                        <h3 className="text-xl font-bold mb-6">إجراءات سريعة</h3>
                        <div className="space-y-3">
                            <Link to="/committee/research" className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 group">
                                <span className="font-bold text-sm">إسناد أبحاث غير موزعة</span>
                                <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] group-hover:translate-x-[-4px] transition">➔</span>
                            </Link>
                            <Link to="/committee/certificates" className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 group">
                                <span className="font-bold text-sm">اعتماد شهادات جاهزة</span>
                                <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] group-hover:translate-x-[-4px] transition">➔</span>
                            </Link>
                            <Link to="/committee/reports" className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 group">
                                <span className="font-bold text-sm">إحصائيات المؤتمر الحالي</span>
                                <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] group-hover:translate-x-[-4px] transition">➔</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm border-r-4 border-r-amber-500">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">⚠️</span>
                            <h3 className="font-bold text-blue-950">مهام يتطلب انتباهك</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                                <p className="text-gray-600 font-medium">هناك 5 أبحاث تم رفضها من أحد المحكمين وتتطلب مراجعة اللجنة.</p>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0"></span>
                                <p className="text-gray-600 font-medium">موعد إغلاق تقديم الأبحاث لمؤتمر الذكاء الاصطناعي غداً.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
