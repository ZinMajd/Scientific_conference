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
                    <h1 className="text-3xl font-black font-['Cairo']" style={{ color: '#001a2e' }}>مؤتمراتي</h1>
                    <p className="text-gray-500 font-medium">إدارة مشاركاتك وحضورك في المؤتمرات العلمية</p>
                </div>
                <Link to="/conferences" className="px-8 py-4 text-white font-bold rounded-none shadow-lg transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ 
                          background: 'linear-gradient(135deg, #003153, #0096c7)',
                          boxShadow: '0 10px 20px -5px rgba(0, 49, 83, 0.3)'
                      }}>
                    <span>🔍</span> استعراض المؤتمرات المتاحة
                </Link>
            </div>

            <div className="grid gap-6">
                {myConferences.length === 0 ? (
                    <div className="bg-white p-20 rounded-none border-2 border-dashed border-gray-200 text-center space-y-4">
                        <div className="text-5xl">📅</div>
                        <h3 className="text-xl font-bold text-gray-400">لم تسجل في أي مؤتمر حتى الآن</h3>
                        <Link to="/conferences" className="font-bold hover:underline inline-block" style={{ color: '#0096c7' }}>ابدأ البحث في المؤتمرات القادمة</Link>
                    </div>
                ) : (
                    myConferences.map((conf) => (
                        <div key={conf.id} className="bg-white p-8 rounded-none border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-8 flex-1">
                                <div className="w-20 h-20 rounded-none flex items-center justify-center text-3xl group-hover:scale-110 transition shrink-0 shadow-sm"
                                     style={{ background: 'rgba(0, 77, 114, 0.08)', color: '#0077b6' }}>🏢</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold" style={{ color: '#001a2e' }}>{conf.title}</h3>
                                        <span className={`px-3 py-1 rounded-none text-[10px] font-black uppercase ${
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
                                        <span className="flex items-center gap-2 font-bold" style={{ color: '#0096c7' }}>🏷️ {conf.type}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                                <button className="px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-none hover:bg-gray-100 transition">تحميل بطاقة الحضور</button>
                                <button 
                                    onClick={() => handleCancel(conf.id)}
                                    className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-none hover:bg-red-100 transition"
                                >إلغاء التسجيل</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="p-12 text-white overflow-hidden relative shadow-2xl rounded-none"
                 style={{ 
                     background: 'linear-gradient(135deg, #001a2e 0%, #003153 60%, #004472 100%)',
                     boxShadow: '0 20px 40px -10px rgba(0, 26, 46, 0.4)'
                 }}>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-2xl font-black mb-4">هل ترغب في تنظيم مؤتمر؟</h2>
                    <p className="text-white/80 leading-relaxed font-medium">بصفتك باحثاً في جامعة إقليم سبأ، يمكنك التقدم بطلب لاستضافة أو تنظيم ورشة عمل علمية متخصصة تحت إشراف اللجنة العليا.</p>
                    <Link 
                        to="/support" 
                        state={{ subject: 'تقديم طلب تنظيم مؤتمر / ورشة عمل علمية' }}
                        className="inline-block mt-8 px-10 py-4 bg-white font-black hover:bg-teal-50 transition transform hover:scale-105 active:scale-95 text-center rounded-none"
                        style={{ color: '#001a2e' }}
                    >
                        تقديم طلب تنظيم
                    </Link>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl text-[200px] flex items-center justify-center opacity-20"
                     style={{ background: 'rgba(64, 224, 208, 0.15)' }}>🔬</div>
            </div>
        </div>
    );
}
