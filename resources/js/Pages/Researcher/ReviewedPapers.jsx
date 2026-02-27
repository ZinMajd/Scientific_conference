import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ResearcherReviewedPapers() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewedPapers = async () => {
            try {
                const response = await axios.get('/api/researcher/reviewed-papers');
                setPapers(response.data);
            } catch (err) {
                console.error('Error fetching reviewed papers:', err);
                setError('حدث خطأ أثناء تحميل الأبحاث المحكمة.');
            } finally {
                setLoading(false);
            }
        };
        fetchReviewedPapers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 bg-red-50 text-red-800 rounded-2xl border border-red-100">{error}</div>;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            <div>
                <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">الأبحاث المحكمة</h1>
                <p className="text-gray-500 font-medium">قائمة الأبحاث التي تم اتخاذ قرار نهائي بشأنها</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest">البحث</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest">المؤتمر</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest text-center">القرار النهائي</th>
                            <th className="px-8 py-6 text-sm font-black text-blue-950 uppercase tracking-widest text-center">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {papers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-20 text-center text-gray-400 font-bold">لا توجد أبحاث محكمة حالياً.</td>
                            </tr>
                        ) : (
                            papers.map((paper) => (
                                <tr key={paper.id} className="hover:bg-gray-50/30 transition group">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition">📄</div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-950 transition line-clamp-1">{paper.title}</h4>
                                                <p className="text-xs text-gray-400 font-medium mt-1">
                                                    {paper.status === 'under_review' ? 'آخر مراجعة: ' : 'تاريخ القرار: '}
                                                    {new Date(paper.decision_date || paper.updated_at).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-sm font-bold text-gray-600">{paper.conference?.title}</span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 mx-auto w-fit ${
                                            paper.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                            paper.status === 'rejected' ? 'bg-red-50 text-red-600' : 
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {paper.status === 'accepted' ? '✅ مقبول' : 
                                             paper.status === 'rejected' ? '❌ مرفوض' : 
                                             '⏳ بانتظار القرار'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <Link to={`/researcher/research/${paper.id}`} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition inline-flex items-center justify-center" title="عرض التفاصيل">👁️</Link>
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
