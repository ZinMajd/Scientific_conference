import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommitteeReports() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('/api/committee/reports/analytics');
                setData(response.data);
            } catch (err) {
                console.error(err);
                setError('فشل في جلب بيانات الإحصائيات.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadCSV = async (endpoint, filename) => {
        try {
            const response = await axios.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('فشل تحميل التقرير. الرجاء المحاولة مرة أخرى.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-xl font-bold text-gray-500">جاري تحميل لوحة التقارير الذكية...</div>;
    }

    if (error) {
        return <div className="text-red-500 font-bold p-10 bg-red-50 rounded-xl">{error}</div>;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-4xl font-black text-emerald-950 font-['Cairo']">لوحة التقارير والتحليلات (Analytics Dashboard)</h1>
                    <p className="text-gray-500 font-bold mt-2">إحصائيات شاملة في الوقت الفعلي لأداء المؤتمرات والباحثين</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handlePrint} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                        <span>🖨️</span> تصدير PDF
                    </button>
                    <button onClick={() => handleDownloadCSV('/api/committee/reports/papers', 'papers_full_report.csv')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                        <span>📊</span> تصدير Excel
                    </button>
                </div>
            </div>

            {/* Print Header (Visible only in print) */}
            <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-8">
                <h1 className="text-3xl font-black">التقرير الإحصائي الشامل للنظام</h1>
                <p className="text-sm mt-2">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {data?.cards.map((card, index) => (
                    <div key={index} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all border-l-8 border-l-${card.color}-500`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gray-50`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{card.title}</p>
                            <h3 className={`text-3xl font-black text-gray-900 mt-1`}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Papers Status Breakdown */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-black text-emerald-950 mb-8 border-b pb-4">حالة الأبحاث التفصيلية</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'المقدمة كلياً', value: data?.paper_stats.total, color: 'bg-gray-800' },
                            { label: 'المقبولة', value: data?.paper_stats.accepted, color: 'bg-emerald-500' },
                            { label: 'المرفوضة', value: data?.paper_stats.rejected, color: 'bg-red-500' },
                            { label: 'قيد التحكيم', value: data?.paper_stats.under_review, color: 'bg-orange-500' },
                            { label: 'قيد الفحص الأولي', value: data?.paper_stats.under_screening, color: 'bg-blue-500' },
                            { label: 'تحتاج تعديلات', value: data?.paper_stats.revision, color: 'bg-amber-500' },
                            { label: 'المنشورة بنجاح', value: data?.paper_stats.published, color: 'bg-purple-500' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold mb-2">
                                    <span className="text-gray-700">{stat.label}</span>
                                    <span className="text-gray-900">{stat.value} بحث</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div className={`${stat.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${data?.paper_stats.total > 0 ? (stat.value / data?.paper_stats.total) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conferences Distribution */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-black text-emerald-950 mb-8 border-b pb-4">الأبحاث حسب المؤتمر</h3>
                    <div className="space-y-6">
                        {data?.by_conference.length > 0 ? data.by_conference.map((conf, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-sm">{conf.name}</p>
                                </div>
                                <div className="w-1/2 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data?.paper_stats.total > 0 ? (conf.count / data?.paper_stats.total) * 100 : 0}%` }}></div>
                                </div>
                                <div className="w-12 text-left font-black text-blue-600">{conf.count}</div>
                            </div>
                        )) : (
                            <p className="text-gray-400 font-bold">لا يوجد بيانات لعرضها.</p>
                        )}
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-100 print:hidden">
                        <button onClick={() => handleDownloadCSV('/api/committee/reports/attendees', 'attendees_report.csv')} className="w-full py-4 bg-emerald-50 text-emerald-700 font-black rounded-xl hover:bg-emerald-100 transition-colors">
                            📥 تحميل إحصائيات الحضور التفصيلية (Excel)
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviewers Performance Table */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8 border-b pb-4 print:border-b-2 print:border-black">
                    <h3 className="text-2xl font-black text-emerald-950">تقرير أداء المحكمين (Reviewer Reports)</h3>
                    <button onClick={() => handleDownloadCSV('/api/committee/reports/reviewers', 'reviewers_performance.csv')} className="text-blue-600 font-black hover:underline print:hidden">تصدير CSV 📥</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-y border-gray-200">
                            <tr>
                                <th className="p-4 font-black text-gray-600">اسم المحكم</th>
                                <th className="p-4 font-black text-gray-600">الأبحاث المسندة</th>
                                <th className="p-4 font-black text-gray-600">المكتملة</th>
                                <th className="p-4 font-black text-gray-600">قيد الانتظار</th>
                                <th className="p-4 font-black text-gray-600">نسبة الإنجاز</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.reviewers.length > 0 ? data.reviewers.map((rev, i) => {
                                const completionRate = rev.assigned > 0 ? Math.round((rev.completed / rev.assigned) * 100) : 0;
                                return (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👤</span>
                                            {rev.name}
                                        </td>
                                        <td className="p-4 font-bold text-gray-600">{rev.assigned}</td>
                                        <td className="p-4 font-black text-emerald-600">{rev.completed}</td>
                                        <td className="p-4 font-bold text-orange-500">{rev.pending}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className={`h-2 rounded-full ${completionRate === 100 ? 'bg-emerald-500' : completionRate > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${completionRate}%` }}></div>
                                                </div>
                                                <span className="text-xs font-black w-10 text-left">{completionRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 font-bold">لا يوجد محكمين حالياً.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <style jsx>{`
                @media print {
                    @page { size: landscape; margin: 1cm; }
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
