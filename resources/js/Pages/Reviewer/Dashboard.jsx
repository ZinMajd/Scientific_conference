import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function ReviewerDashboard() {
    const [stats, setStats] = useState({ pending_reviews: 0, completed_reviews: 0, total_assigned: 0 });
    const [loading, setLoading] = useState(true);
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    useEffect(() => {
        axios.get('/api/reviewer/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const mainStats = [
        { title: 'بانتظار التحكيم', value: stats.pending_reviews, icon: '⚖️', color: OCEAN, path: '/reviewer/assignments' },
        { title: 'تم تحكيمها', value: stats.completed_reviews, icon: '✅', color: '#059669', path: '/reviewer/history' },
        { title: 'إجمالي التكليفات', value: stats.total_assigned, icon: '📄', color: PRUSSIAN, path: '/reviewer/assignments' },
        { title: 'تنبيهات نشطة', value: '4', icon: '🔔', color: '#d97706', path: '#' },
    ];

    const assignedPapers = [
        { id: 1, title: 'تأثير الحوسبة السحابية على أمن البيانات', researcher: 'أحمد علي', deadline: '2026-02-01', urgent: true },
        { id: 2, title: 'خوارزميات التعلم العميق في التشخيص الطبي', researcher: 'سارة محمد', deadline: '2026-02-15', urgent: false },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="p-6 rounded-2xl text-white"
                style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                <h1 className="text-2xl font-black mb-1">
                    مرحباً، دكتور {user?.full_name || 'المحكّم'} 👋
                </h1>
                <p className="text-white/60 text-sm">
                    لديك <span className="font-black" style={{ color: TURQUOISE }}>{stats.pending_reviews}</span> بحث بانتظار قرارك العلمي
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat, idx) => (
                    <Link key={idx} to={stat.path || '#'}
                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group flex items-center gap-4"
                        style={{ border: `1px solid ${TURQUOISE}25` }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white shrink-0 group-hover:scale-110 transition"
                            style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)` }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-bold leading-tight">{stat.title}</p>
                            <h3 className="text-2xl font-black" style={{ color: PRUSSIAN }}>
                                {loading ? '—' : stat.value}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                    {/* Assigned Papers */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden"
                        style={{ border: `1px solid ${TURQUOISE}25` }}>
                        <div className="p-5 flex justify-between items-center"
                            style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                            <h2 className="text-lg font-bold" style={{ color: PRUSSIAN }}>الأبحاث المسندة حديثاً</h2>
                            <Link to="/reviewer/assignments" className="text-xs font-bold hover:underline" style={{ color: OCEAN }}>
                                بدء التحكيم
                            </Link>
                        </div>
                        <div className="divide-y" style={{ borderColor: `${TURQUOISE}15` }}>
                            {assignedPapers.map(paper => (
                                <div key={paper.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition group">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                                            style={{ background: `${TURQUOISE}15` }}>📋</div>
                                        <div>
                                            <h4 className="font-bold text-sm truncate max-w-xs" style={{ color: PRUSSIAN }}>{paper.title}</h4>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-[10px] text-gray-400 font-bold">الباحث: {paper.researcher}</span>
                                                <span className="text-[10px] font-bold" style={{ color: OCEAN }}>الموعد: {paper.deadline}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black shrink-0"
                                        style={paper.urgent ? { background: '#fee2e2', color: '#dc2626' } : { background: `${TURQUOISE}15`, color: OCEAN }}>
                                        {paper.urgent ? 'عاجل' : 'طبيعي'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Guide Banner */}
                    <div className="p-6 rounded-2xl text-white relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}, ${PRUSSIAN})` }}>
                        <div className="absolute top-0 left-0 w-48 h-48 rounded-full -translate-x-16 -translate-y-16 opacity-10"
                            style={{ background: TURQUOISE }}></div>
                        <div className="relative z-10 flex items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-black mb-2">دليل معايير التحكيم</h3>
                                <p className="text-white/60 text-sm leading-relaxed max-w-md">
                                    يرجى مراجعة المعايير العلمية المحدثة لعام 2026 لضمان جودة الأبحاث المنشورة.
                                </p>
                                <button className="mt-4 px-5 py-2 rounded-xl font-bold text-sm transition hover:scale-105"
                                    style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>
                                    تحميل الدليل (PDF)
                                </button>
                            </div>
                            <span className="text-5xl hidden md:block">🛡️</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    <div className="bg-white p-5 rounded-2xl shadow-sm" style={{ border: `1px solid ${TURQUOISE}25` }}>
                        <h2 className="text-base font-bold mb-4" style={{ color: PRUSSIAN }}>الشهادات الحالية</h2>
                        <div className="p-4 rounded-xl mb-4 flex items-center gap-4"
                            style={{ background: `${TURQUOISE}10`, border: `1px solid ${TURQUOISE}25` }}>
                            <span className="text-2xl">🏅</span>
                            <div>
                                <h4 className="font-bold text-xs" style={{ color: PRUSSIAN }}>شهادة محكم متميز</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">مؤتمر الذكاء الاصطناعي</p>
                            </div>
                        </div>
                        <Link to="/reviewer/history"
                            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
                            style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                            <span>📜</span> سجل الأبحاث المحكمة
                        </Link>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50" style={{ border: '1px solid #fcd34d' }}>
                        <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                            💡 تنبيه هام
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            تم تمديد فترة التحكيم لمؤتمر الأمن السيبراني لمدة 3 أيام إضافية.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
