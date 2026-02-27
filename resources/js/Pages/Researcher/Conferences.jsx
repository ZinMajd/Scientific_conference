import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResearcherConferences() {
    const [myConferences, setMyConferences] = useState([
        { 
            id: 1, 
            title: 'المؤتمر الدولي الأول للذكاء الاصطناعي 2024', 
            date: '25 مارس 2024', 
            location: 'مأرب - جامعة إقليم سبأ', 
            status: 'completed', 
            type: 'مشارك ببحث',
            description: 'يهدف المؤتمر لمناقشة تطبيقات الذكاء الاصطناعي في خدمة المجتمع والتنمية المستدامة في إقليم سبأ.'
        },
        { id: 2, title: 'ملتقى الأمن السيبراني والتحول الرقمي', date: '22 يونيو 2026', location: 'عن بعد (Virtual)', status: 'pending', type: 'مستمع' },
    ]);

    const handleCancel = (id) => {
        if(window.confirm('هل أنت متأكد من رغبتك في إلغاء التسجيل في هذا المؤتمر؟')) {
            setMyConferences(myConferences.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">مؤتمراتي</h1>
                    <p className="text-gray-500 font-medium">إدارة مشاركاتك وحضورك في المؤتمرات العلمية</p>
                </div>
                <Link to="/conferences" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-2">
                    <span>🔍</span> استعراض المؤتمرات المتاحة
                </Link>
            </div>

            <div className="grid gap-6">
                {myConferences.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-200 text-center space-y-4">
                        <div className="text-5xl">📅</div>
                        <h3 className="text-xl font-bold text-gray-400">لم تسجل في أي مؤتمر حتى الآن</h3>
                        <Link to="/conferences" className="text-blue-600 font-bold hover:underline inline-block">ابدأ البحث في المؤتمرات القادمة</Link>
                    </div>
                ) : (
                    myConferences.map((conf) => (
                        <div key={conf.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8 flex-1">
                                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition shrink-0 shadow-sm">🏢</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-blue-950">{conf.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                            conf.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                            conf.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {conf.status === 'completed' ? 'منتهي ✓' : conf.status === 'confirmed' ? 'تم التأكيد' : 'قيد المعالجة'}
                                        </span>
                                    </div>
                                    {conf.description && (
                                        <p className="text-sm text-gray-600 leading-relaxed mt-2">{conf.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                                        <span className="flex items-center gap-2">📅 {conf.date}</span>
                                        <span className="flex items-center gap-2">📍 {conf.location}</span>
                                        <span className="flex items-center gap-2 text-blue-600 font-bold">🏷️ {conf.type}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                                <button className="px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition">تحميل بطاقة الحضور</button>
                                <button 
                                    onClick={() => handleCancel(conf.id)}
                                    className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                                >إلغاء التسجيل</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="bg-blue-950 p-12 rounded-[3.5rem] text-white overflow-hidden relative shadow-2xl shadow-blue-900/40">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black mb-4">هل ترغب في تنظيم مؤتمر؟</h2>
                    <p className="text-blue-200 leading-relaxed font-medium">بصفتك باحثاً في جامعة إقليم سبأ، يمكنك التقدم بطلب لاستضافة أو تنظيم ورشة عمل علمية متخصصة تحت إشراف اللجنة العليا.</p>
                    <button className="mt-8 px-10 py-4 bg-white text-blue-950 font-black rounded-2xl hover:bg-blue-50 transition transform hover:scale-105 active:scale-95">تقديم طلب تنظيم</button>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-900/50 rounded-full blur-3xl text-[200px] flex items-center justify-center opacity-20">🔬</div>
            </div>
        </div>
    );
}
