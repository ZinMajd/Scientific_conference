import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ResearcherDashboard() {
    const [stats, setStats] = useState({
        papers_count: 0,
        accepted_count: 0,
        under_review: 0,
        active_conferences: 0
    });
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, papersRes] = await Promise.all([
                    axios.get('/api/researcher/stats'),
                    axios.get('/api/researcher/papers')
                ]);
                setStats(statsRes.data);
                setPapers(papersRes.data);
            } catch (err) {
                console.error('Error fetching researcher dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mainStats = [
        { title: 'أبحاث مقدمة', value: stats.papers_count, trend: stats.papers_count > 0 ? '+1' : '0', color: 'bg-blue-600', icon: '📄' },
        { title: 'أبحاث مقبولة', value: stats.accepted_count, trend: '0', color: 'bg-emerald-500', icon: '✅' },
        { title: 'تحت المراجعة', value: stats.under_review, trend: '0', color: 'bg-amber-500', icon: '⚖️' },
        { title: 'مؤتمرات نشطة', value: stats.active_conferences, trend: 'جديد', color: 'bg-indigo-600', icon: '🏛️' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                            {stat.icon}
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
                {/* Papers List */}
                <div className="lg:col-span-2 bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-xl font-bold text-blue-950">أبحاثي الأخيرة</h2>
                        <Link to="/researcher/research" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">عرض الكل</Link>
                    </div>
                    <div className="p-8">
                        {papers.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-400">لا توجد أبحاث مقدمة حالياً.</p>
                                <Link to="/researcher/research/create" className="text-blue-600 font-bold mt-2 inline-block">قدم بحثك الأول الآن</Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {papers.map((paper) => (
                                    <div key={paper.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl">📄</div>
                                            <div>
                                                <h4 className="font-bold text-blue-950 group-hover:text-blue-600 transition">{paper.title}</h4>
                                                <p className="text-xs text-gray-400 font-medium mt-1">{paper.conference?.title}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            paper.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            paper.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {paper.status === 'submitted' ? 'مقدم' : 
                                             paper.status === 'under_review' ? 'قيد التحكيم' : 
                                             paper.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Actions */}
                <div className="space-y-6">
                    <div className="bg-blue-950 p-8 rounded-4xl text-white shadow-2xl shadow-blue-900/30">
                        <h3 className="text-xl font-bold mb-6">إجراءات سريعة</h3>
                        <div className="space-y-3">
                            <Link to="/researcher/research/create" className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 group">
                                <span className="font-bold text-sm">تقديم بحث جديد</span>
                                <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] group-hover:translate-x-[-4px] transition">➔</span>
                            </Link>
                            <Link to="/researcher/reviews" className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition border border-white/10 group">
                                <span className="font-bold text-sm">سجل التحكيم</span>
                                <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] group-hover:translate-x-[-4px] transition">➔</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm border-r-4 border-r-amber-500">
                        <h3 className="font-bold text-blue-950 mb-4">تنبيهات هامة</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">يرجى الالتزام بمواعيد التقديم النهائية للمؤتمرات المعلنة لتجنب استبعاد الأبحاث.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
