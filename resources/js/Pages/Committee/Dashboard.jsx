import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function CommitteeDashboard() {
    const [stats, setStats] = useState({ total_papers: 0, total_conferences: 0, total_reviewers: 0, total_attendees: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/committee/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error('Error fetching committee stats:', err))
            .finally(() => setLoading(false));
    }, []);

    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    const mainStats = [
        { title: 'إجمالي الأبحاث', value: stats.total_papers, icon: '📄', color: OCEAN },
        { title: 'المحكمين', value: stats.total_reviewers, icon: '⚖️', color: '#7c3aed' },
        { title: 'المؤتمرات', value: stats.total_conferences, icon: '🏛️', color: '#059669' },
        { title: 'المسجلين', value: stats.total_attendees, icon: '👥', color: '#d97706' },
    ];

    const recentActivities = [
        { id: 1, action: 'إسناد بحث جديد', details: 'تم إسناد "تأمين الشبكات" للمحكم د. صالح', time: '10:30 ص', icon: '🔗' },
        { id: 2, action: 'توصية قبول', details: 'أوصى المحكم د. سحر بقبول بحث "الذكاء الاصطناعي"', time: '9:15 ص', icon: '⚖️' },
        { id: 3, action: 'إنشاء جلسة', details: 'تمت جدولة جلسة "الأمن السيبراني" لليوم الثاني', time: 'أمس', icon: '🕒' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 100%)` }}>
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">
                        مرحباً، {user?.full_name || 'عضو اللجنة'} 👋
                    </h1>
                    <p className="text-white/60 text-sm">لوحة تحكم اللجنة العلمية - نظرة عامة على الأنشطة</p>
                </div>
                <Link to="/committee/conferences"
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>
                    ➕ إدارة المؤتمرات
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group"
                        style={{ border: `1px solid ${TURQUOISE}25` }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-md group-hover:scale-110 transition"
                                style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)` }}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-black" style={{ color: PRUSSIAN }}>
                            {loading ? '—' : stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{ border: `1px solid ${TURQUOISE}25` }}>
                    <div className="p-6 flex justify-between items-center"
                        style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                        <h2 className="text-lg font-bold" style={{ color: PRUSSIAN }}>آخر النشاطات الإدارية</h2>
                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${TURQUOISE}15`, color: OCEAN }}>
                            سجل العمليات
                        </span>
                    </div>
                    <div className="p-6 space-y-6">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
                                    style={{ background: `${TURQUOISE}15` }}>
                                    {act.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm" style={{ color: PRUSSIAN }}>{act.action}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold">{act.time}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{act.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-5">
                    <div className="p-6 rounded-2xl text-white shadow-xl"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 100%)` }}>
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                            <span style={{ color: TURQUOISE }}>⚡</span> إجراءات سريعة
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'إسناد أبحاث غير موزعة', path: '/committee/research' },
                                { label: 'اعتماد شهادات جاهزة', path: '/committee/certificates' },
                                { label: 'إحصائيات المؤتمر', path: '/committee/reports' },
                            ].map((item, i) => (
                                <Link key={i} to={item.path}
                                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.02]"
                                    style={{ background: `${TURQUOISE}15`, border: `1px solid ${TURQUOISE}20` }}>
                                    <span className="font-semibold text-sm">{item.label}</span>
                                    <span style={{ color: TURQUOISE }}>←</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm"
                        style={{ border: `1px solid ${TURQUOISE}25`, borderRight: `4px solid #f59e0b` }}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">⚠️</span>
                            <h3 className="font-bold text-sm" style={{ color: PRUSSIAN }}>يتطلب انتباهك</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-xs text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                5 أبحاث رُفضت وتتطلب مراجعة اللجنة
                            </li>
                            <li className="flex gap-2 text-xs text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                موعد إغلاق تقديم الأبحاث غداً
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
