import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommitteeResults() {
    const [papers, setPapers] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/committee/papers');
            const data = response.data.data || [];
            setPapers(data);
            
            const s = { total: data.length, accepted: 0, pending: 0, rejected: 0 };
            data.forEach(p => {
                if (p.status === 'accepted') s.accepted++;
                else if (p.status === 'rejected') s.rejected++;
                else s.pending++;
            });
            setStats(s);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">نتائج المؤتمر والنشر</h1>
                    <p className="text-gray-500 font-medium">عرض الأبحاث المقبولة نهائياً والمؤرشفة للنشر العلمي</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition shadow-sm">📑 أرشيف النشر</button>
                    <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition">📊 تقرير الأصالة</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'إجمالي الأوراق', val: stats.total, color: 'text-emerald-950', bg: 'bg-white' },
                    { label: 'المقبولة للنشر', val: stats.accepted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'بانتظار القرار', val: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'المرفوضة', val: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' }
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} p-6 rounded-3xl border border-gray-100 shadow-sm`}>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                        <h3 className={`text-3xl font-black ${s.color} mt-1`}>{s.val}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">كود البحث</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">عنوان البحث</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المؤلف</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">النتيجة النهائية</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">التوثيق (DOI)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-gray-400 font-bold">جاري تحميل النتائج...</td></tr>
                        ) : papers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-gray-400 font-bold">لا توجد نتائج متاحة حالياً.</td></tr>
                        ) : (
                            papers.map(paper => (
                                <tr key={paper.id} className="hover:bg-gray-50/50 transition duration-300">
                                    <td className="px-8 py-8 text-center text-xs font-black text-emerald-950">#{paper.id}</td>
                                    <td className="px-8 py-8">
                                        <h5 className="font-bold text-gray-900 line-clamp-1">{paper.title}</h5>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1">Track: {paper.track || 'General'}</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-xs font-bold text-gray-600">{paper.author?.full_name}</span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                                            paper.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            paper.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                            {paper.status === 'accepted' ? 'مقبول للنشر' : paper.status === 'rejected' ? 'مرفوض' : 'قيد المعالجة'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        {paper.status === 'accepted' ? (
                                            <span className="text-[10px] font-black text-blue-600 hover:underline cursor-pointer">10.saba/conf.{paper.id}</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
