import React, { useState } from 'react';
import axios from 'axios';

export default function CommitteeReports() {
    const [loading, setLoading] = useState(false);

    const reports = [
        { title: 'تقرير الأبحاث', endpoint: '/api/committee/reports/papers', filename: 'papers_report.csv' },
        { title: 'نشاط المحكمين', endpoint: '/api/committee/reports/reviewers', filename: 'reviewers_report.csv' },
        { title: 'إحصائيات الحضور', endpoint: '/api/committee/reports/attendees', filename: 'attendees_report.csv' }
    ];

    const handleDownload = async (report) => {
        setLoading(true);
        try {
            const response = await axios.get(report.endpoint, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', report.filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('فشل تحميل التقرير. الرجاء المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">التقارير والإحصائيات</h1>
                <p className="text-gray-500 font-medium">استخراج تقارير شاملة عن المؤتمر، الأبحاث، والمحكمين</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reports.map((report, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition">📊</div>
                        <h3 className="text-xl font-black text-emerald-950">{report.title}</h3>
                        <p className="text-gray-500 text-sm mt-2 font-medium">عرض وتحميل بيانات {report.title} بصيغة CSV.</p>
                        <button 
                            onClick={() => handleDownload(report)}
                            disabled={loading}
                            className="mt-8 text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline disabled:opacity-50"
                        >
                            {loading ? 'جاري التحميل...' : 'تحميل التقرير ➔'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
