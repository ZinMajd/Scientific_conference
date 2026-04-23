import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

const statusMap = {
    submitted: { label: 'مقدم', color: '#0096c7', bg: '#e0f7fa' },
    under_review: { label: 'قيد التحكيم', color: '#d97706', bg: '#fef3c7' },
    accepted: { label: 'مقبول', color: '#059669', bg: '#d1fae5' },
    rejected: { label: 'مرفوض', color: '#dc2626', bg: '#fee2e2' },
};

export default function ResearcherDashboard() {
    const [stats, setStats] = useState({ papers_count: 0, accepted_count: 0, under_review: 0, active_conferences: 0 });
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    useEffect(() => {
        Promise.all([axios.get('/api/researcher/stats'), axios.get('/api/researcher/papers')])
            .then(([statsRes, papersRes]) => {
                setStats(statsRes.data);
                setPapers(Array.isArray(papersRes.data) ? papersRes.data : []);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const mainStats = [
        { title: 'أبحاث مقدمة', value: stats.papers_count, icon: '📄', color: OCEAN },
        { title: 'أبحاث مقبولة', value: stats.accepted_count, icon: '✅', color: '#059669' },
        { title: 'تحت المراجعة', value: stats.under_review, icon: '⚖️', color: '#d97706' },
        { title: 'مؤتمرات نشطة', value: stats.active_conferences, icon: '🏛️', color: PRUSSIAN },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: `${TURQUOISE} transparent ${TURQUOISE} transparent` }}></div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="p-6 rounded-2xl text-white"
                style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                <h1 className="text-2xl font-black mb-1">
                    مرحباً، {user?.full_name || 'الباحث'} 👋
                </h1>
                <p className="text-white/60 text-sm">لوحة تحكم الباحث - تابع أبحاثك ومؤتمراتك</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all group"
                        style={{ border: `1px solid ${TURQUOISE}25` }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white mb-4 group-hover:scale-110 transition"
                            style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)` }}>
                            {stat.icon}
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-black" style={{ color: PRUSSIAN }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Papers List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{ border: `1px solid ${TURQUOISE}25` }}>
                    <div className="p-5 flex justify-between items-center"
                        style={{ borderBottom: `1px solid ${TURQUOISE}20` }}>
                        <h2 className="text-lg font-bold" style={{ color: PRUSSIAN }}>أبحاثي الأخيرة</h2>
                        <Link to="/researcher/research" className="text-xs font-bold hover:underline" style={{ color: OCEAN }}>
                            عرض الكل
                        </Link>
                    </div>
                    <div className="p-5">
                        {papers.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-3">📭</div>
                                <p className="text-gray-400 mb-3">لا توجد أبحاث مقدمة حالياً</p>
                                <Link to="/researcher/research/create"
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                                    style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                                    قدم بحثك الأول الآن
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {papers.map((paper) => {
                                    const s = statusMap[paper.status] || { label: paper.status, color: '#6b7280', bg: '#f3f4f6' };
                                    return (
                                        <div key={paper.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition group"
                                            style={{ border: `1px solid ${TURQUOISE}20` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                                    style={{ background: `${TURQUOISE}15` }}>📄</div>
                                                <div>
                                                    <h4 className="font-bold text-sm" style={{ color: PRUSSIAN }}>{paper.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">{paper.conference?.title || '—'}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black"
                                                style={{ background: s.bg, color: s.color }}>
                                                {s.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Side */}
                <div className="space-y-5">
                    <div className="p-6 rounded-2xl text-white"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}, ${PRUSSIAN})` }}>
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span style={{ color: TURQUOISE }}>⚡</span> إجراءات سريعة
                        </h3>
                        {[
                            { label: 'تقديم بحث جديد', path: '/researcher/research/create' },
                            { label: 'سجل التحكيم', path: '/researcher/reviews' },
                            { label: 'المؤتمرات المتاحة', path: '/conferences' },
                        ].map((item, i) => (
                            <Link key={i} to={item.path}
                                className="w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all hover:scale-[1.02]"
                                style={{ background: `${TURQUOISE}15`, border: `1px solid ${TURQUOISE}20` }}>
                                <span className="font-semibold text-sm">{item.label}</span>
                                <span style={{ color: TURQUOISE }}>←</span>
                            </Link>
                        ))}
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm"
                        style={{ border: `1px solid ${TURQUOISE}25`, borderRight: '4px solid #f59e0b' }}>
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: PRUSSIAN }}>
                            ⚠️ تنبيهات هامة
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            يرجى الالتزام بمواعيد التقديم النهائية للمؤتمرات المعلنة لتجنب استبعاد الأبحاث.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
