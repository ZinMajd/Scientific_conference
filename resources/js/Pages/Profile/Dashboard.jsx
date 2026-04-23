import React from 'react';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Dashboard() {
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    const menuItems = [
        { label: 'الملف الشخصي', icon: '👤', active: true },
        { label: 'أبحاثي', icon: '📄' },
        { label: 'المؤتمرات المسجلة', icon: '🏛️' },
        { label: 'شهادات الحضور', icon: '📜' },
        { label: 'الإشعارات', icon: '🔔' },
        { label: 'تسجيل الخروج', icon: '🚪', color: '#ef4444' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Menu */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 h-fit overflow-hidden relative"
                    style={{ border: `1px solid ${TURQUOISE}20` }}>
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-xl relative ring-4 ring-[#40E0D0]10">
                            <img src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.username}&background=003153&color=fff&size=128`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-black text-xl" style={{ color: PRUSSIAN }}>{user?.full_name || user?.name || 'مستخدم'}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: OCEAN }}>{user?.user_type || 'باحث'}</p>
                    </div>
                    
                    <nav className="space-y-2 relative z-10">
                        {menuItems.map((item, idx) => (
                            <button key={idx} 
                                className={`w-full text-right px-5 py-3.5 rounded-2xl transition-all font-bold flex items-center gap-3 ${item.active ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                style={item.active ? { background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})`, boxShadow: `0 8px 20px ${PRUSSIAN}20` } : { color: item.color }}>
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Welcome Banner */}
                    <div className="p-8 rounded-[2rem] text-white overflow-hidden relative"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2">مرحباً بك مجدداً!</h2>
                            <p className="text-white/70 text-sm">يمكنك هنا إدارة بياناتك الشخصية ومتابعة تقدم أبحاثك العلمية.</p>
                        </div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10" style={{ background: TURQUOISE }}></div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'الأبحاث المقدمة', val: '3', icon: '📝', color: OCEAN },
                            { label: 'المؤتمرات', val: '1', icon: '🏛️', color: PRUSSIAN },
                            { label: 'الشهادات', val: '5', icon: '📜', color: '#059669' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-md transition-all"
                                style={{ border: `1px solid ${TURQUOISE}15` }}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${stat.color}15`, color: stat.color }}>إجمالي</span>
                                </div>
                                <h4 className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-widest">{stat.label}</h4>
                                <p className="text-3xl font-black" style={{ color: PRUSSIAN }}>{stat.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden"
                        style={{ border: `1px solid ${TURQUOISE}20` }}>
                        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: `${TURQUOISE}15` }}>
                            <h3 className="font-bold text-lg" style={{ color: PRUSSIAN }}>سجل الأنشطة الحديثة</h3>
                            <button className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${TURQUOISE}15`, color: OCEAN }}>مشاهدة الكل</button>
                        </div>
                        <div className="divide-y" style={{ borderColor: `${TURQUOISE}10` }}>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-6 hover:bg-gray-50/50 transition flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                                        style={{ background: `${TURQUOISE}15` }}>
                                        🔔
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm" style={{ color: PRUSSIAN }}>تم قبول الملخص البحثي</h4>
                                        <p className="text-xs text-gray-400 mt-1">تم قبول ملخص بحثك للمؤتمر الدولي للذكاء الاصطناعي بنجاح.</p>
                                    </div>
                                    <span className="text-[10px] text-gray-300 font-bold whitespace-nowrap">منذ ساعتين</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
