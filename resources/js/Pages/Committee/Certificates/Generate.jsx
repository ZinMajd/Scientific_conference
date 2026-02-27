import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommitteeCertificatesGenerate() {
    const [stats, setStats] = useState({ researchers: 0, reviewers: 0, attendance: 0 });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/committee/stats');
            setStats({
                researchers: response.data.total_papers, // simplified
                reviewers: 12, // mock or fetch
                attendance: 150
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (type) => {
        setGenerating(true);
        // Simulate generation process
        setTimeout(() => {
            setGenerating(false);
            alert(`تم البدء في توليد شهادات ${type} بنجاح. سيتم إرسالها عبر البريد الإلكتروني.`);
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div>
                <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">مركز إصدار الشهادات الذكي</h1>
                <p className="text-gray-500 font-medium">توليد وإرسال شهادات المشاركة والتحكيم أوتوماتيكياً</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                    { title: 'شهادات الباحثين', count: stats.researchers, icon: '🎓', type: 'التقديم المقبول' },
                    { title: 'شهادات المحكمين', count: stats.reviewers, icon: '⚖️', type: 'التحكيم العلمي' },
                    { title: 'شهادات الحضور', count: stats.attendance, icon: '🎫', type: 'المشاركة بالحضور' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl">{item.icon}</div>
                        <div>
                            <h3 className="text-xl font-black text-emerald-950">{item.title}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-1">المستحقون: {item.count} شخص</p>
                        </div>
                        <button 
                            disabled={generating}
                            onClick={() => handleGenerate(item.title)}
                            className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg border border-emerald-500 hover:bg-emerald-700 transition disabled:opacity-50"
                        >
                            توليد وإرسال الجماعي ➔
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <h2 className="text-2xl font-black italic">ختام أعمال المؤتمر - جامعة إقليم سبأ</h2>
                    <p className="text-emerald-200/80 font-medium leading-relaxed max-w-2xl">
                        سيتم أرشفة كافة المراسلات والبيانات العلمية فور الانتهاء من إصدار الشهادات. 
                        نشكر كافة الجهود المبذولة في إنجاح الدورة الحالية للمؤتمر.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white text-emerald-950 font-black rounded-2xl hover:bg-emerald-50 transition">📂 تصدير الأرشيف النهائي</button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition">🏁 إغلاق بوابة المؤتمر</button>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-900 rounded-full blur-3xl opacity-50"></div>
            </div>
        </div>
    );
}
