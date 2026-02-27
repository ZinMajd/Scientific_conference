import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerDashboard() {
    const [stats, setStats] = useState({
        pending_reviews: 0,
        completed_reviews: 0,
        total_assigned: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/reviewer/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching reviewer stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const mainStats = [
        { title: 'أبحاث بانتظار التحكيم', value: stats.pending_reviews, color: 'bg-indigo-900', icon: '⚖️', path: '/reviewer/assignments' },
        { title: 'أبحاث تم تحكيمها', value: stats.completed_reviews, color: 'bg-emerald-600', icon: '✅', path: '/reviewer/history' },
        { title: 'إجمالي التكليفات', value: stats.total_assigned, color: 'bg-blue-600', icon: '📄', path: '/reviewer/assignments' },
        { title: 'تنبيهات نشطة', value: '4', color: 'bg-amber-500', icon: '🔔', path: '#' }
    ];

    const assignedPapers = [
        { id: 1, title: 'تأثير الحوسبة السحابية على أمن البيانات', researcher: 'أحمد علي', deadline: '2026-02-01', status: 'عاجل' },
        { id: 2, title: 'خوارزميات التعلم العميق في التشخيص الطبي', researcher: 'سارة محمد', deadline: '2026-02-15', status: 'طبيعي' },
    ];

    return (
        <div className="space-y-10">
            {/* Greeting */}
            <div>
                <h1 className="text-3xl font-black text-indigo-950 mb-2 font-['Cairo']">لوحة تحكم المحكّم</h1>
                <p className="text-gray-500">مرحباً بك دكتور. لديك 4 أبحاث بانتظار قرارك العلمي.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <Link to={stat.path || '#'} key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition group">
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold">{stat.title}</p>
                            <h3 className="text-3xl font-black text-indigo-950">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Assignments Tracker */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
                            <h2 className="text-xl font-bold text-indigo-950">الأبحاث المسندة حديثاً</h2>
                            <Link to="/reviewer/assignments" className="text-sm text-indigo-600 font-bold hover:underline">بدء التحكيم</Link>
                        </div>
                        <div className="p-6 divide-y divide-gray-50">
                            {assignedPapers.map((paper) => (
                                <div key={paper.id} className="py-4 flex items-center justify-between group hover:bg-gray-50 transition rounded-xl px-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-indigo-950 group-hover:text-indigo-600 transition truncate max-w-sm">{paper.title}</h4>
                                        <div className="flex gap-4 mt-1">
                                            <p className="text-[10px] text-gray-400 uppercase font-black">الباحث: {paper.researcher}</p>
                                            <p className="text-[10px] text-indigo-400 uppercase font-black">الموعد النهائي: {paper.deadline}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${paper.status === 'عاجل' ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                                        {paper.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Guidelines */}
                    <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black mb-3">دليل معايير التحكيم</h3>
                                <p className="text-indigo-200 text-sm max-w-md">يرجى مراجعة المعايير العلمية المحدثة لعام 2026 لضمان جودة الأبحاث المنشورة في جامعة إقليم سبأ.</p>
                                <button className="mt-6 px-6 py-2 bg-white text-indigo-950 rounded-xl font-bold hover:bg-indigo-50 transition">تحميل الدليل (PDF)</button>
                            </div>
                            <span className="text-6xl hidden md:block">🛡️</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-md">المهام النشطة</button>
                        <Link to="/reviewer/history" className="px-6 py-2 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition">التاريخ</Link>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-indigo-950 mb-6 font-['Cairo']">الشهادات الحالية</h2>
                        <div className="space-y-4">
                            <div className="p-4 border border-indigo-50 bg-indigo-50/30 rounded-2xl flex items-center gap-4">
                                <span className="text-2xl">🏅</span>
                                <div>
                                    <h4 className="text-xs font-bold text-indigo-950">شهادة محكم متميز</h4>
                                    <p className="text-[10px] text-indigo-400 mt-1 uppercase font-black">مؤتمر الذكاء الاصطناعي</p>
                                </div>
                            </div>
                        </div>
                         <button className="w-full mt-6 py-3 bg-gray-50 text-indigo-950 rounded-xl text-sm font-bold hover:bg-indigo-100 transition border border-gray-100">
                              عرض جميع الشهادات
                         </button>
                         <Link to="/reviewer/history" className="w-full mt-3 py-3 bg-indigo-950 text-white rounded-xl text-sm font-bold hover:bg-indigo-900 transition flex items-center justify-center gap-2">
                              <span>📜</span> سجل الأبحاث المحكمة
                         </Link>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3 text-sm">
                            <span>💡</span> تنبيه هام
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            تم تمديد فترة التحكيم لمؤتمر الأمن السيبراني لمدة 3 أيام إضافية للتأكد من دقة المراجعات العلمية.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
