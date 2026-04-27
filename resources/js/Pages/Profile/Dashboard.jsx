import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

const MENU_ITEMS = [
    { id: 'profile', label: 'الملف الشخصي', icon: '👤', active: true, color: '#64748b' },
    { id: 'papers', label: 'أبحاثي', icon: '📄', color: '#64748b' },
    { id: 'conferences', label: 'المؤتمرات المسجلة', icon: '🏛️', color: '#64748b' },
    { id: 'certificates', label: 'شهادات الحضور', icon: '📜', color: '#64748b' },
    { id: 'notifications', label: 'الإشعارات', icon: '🔔', color: '#64748b' },
    { id: 'logout', label: 'تسجيل الخروج', icon: '🚪', color: '#ef4444' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const user = useMemo(() => {
        try {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            return null;
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchStats = async () => {
            try {
                let res;
                const role = user.user_type === 'researcher' ? 'author' : user.user_type;
                
                if (role === 'author') {
                    res = await axios.get('/api/researcher/stats');
                    setStats([
                        { id: 's1', label: 'الأبحاث المقدمة', val: res.data.papers_count, icon: '📝', color: OCEAN },
                        { id: 's2', label: 'مع المحرر/المكتب', val: res.data.with_editor, icon: '👨‍🏫', color: '#f59e0b' },
                        { id: 's3', label: 'قيد التحكيم', val: res.data.under_review, icon: '⚖️', color: PRUSSIAN },
                        { id: 's4', label: 'المقبولة', val: res.data.accepted_count, icon: '✅', color: '#059669' },
                    ]);
                } else if (role === 'reviewer') {
                    res = await axios.get('/api/reviewer/stats');
                    setStats([
                        { id: 'r1', label: 'بانتظار التحكيم', val: res.data.pending_reviews, icon: '⏳', color: OCEAN },
                        { id: 'r2', label: 'تم تحكيمها', val: res.data.completed_reviews, icon: '✅', color: '#059669' },
                        { id: 'r3', label: 'إجمالي التكليفات', val: res.data.total_assigned, icon: '📄', color: PRUSSIAN },
                    ]);
                } else {
                    res = await axios.get('/api/committee/stats');
                    setStats([
                        { id: 'c1', label: 'بانتظار الفحص الفني', val: res.data.technical_check_count, icon: '🔍', color: '#f59e0b' },
                        { id: 'c2', label: 'مع المحرر العلمي', val: res.data.with_editor_count, icon: '👨‍🏫', color: OCEAN },
                        { id: 'c3', label: 'قيد التحكيم', val: res.data.under_review_count, icon: '⚖️', color: PRUSSIAN },
                        { id: 'c4', label: 'إجمالي الأبحاث', val: res.data.total_papers, icon: '📚', color: '#059669' },
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl font-['Cairo']">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Menu */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-fit overflow-hidden relative"
                    style={{ border: `1px solid ${TURQUOISE}20` }}>
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-xl relative"
                            style={{ boxShadow: '0 0 0 4px rgba(64, 224, 208, 0.1)' }}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.username}&background=003153&color=fff&size=128`} 
                                alt={`صورة الملف الشخصي لـ ${user?.full_name || user?.username}`} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <h3 className="font-black text-xl" style={{ color: PRUSSIAN }}>{user?.full_name || 'مستخدم'}</h3>
                        <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: OCEAN }}>{user?.user_type || 'باحث'}</p>
                    </div>
                    
                    <nav className="relative z-10">
                        <ul className="space-y-2">
                            {MENU_ITEMS.map((item) => (
                                <li key={item.id}>
                                    <button 
                                        type="button"
                                        className={`w-full text-right px-5 py-3.5 rounded-2xl transition-all font-bold flex items-center gap-3 ${item.active ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                        style={item.active ? { background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})`, boxShadow: `0 8px 20px ${PRUSSIAN}20` } : { color: item.color }}>
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Welcome Banner */}
                    <div className="p-8 rounded-3xl text-white overflow-hidden relative"
                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black mb-2">مرحباً بك مجدداً!</h2>
                            <p className="text-white/70 text-sm">يمكنك هنا إدارة بياناتك الشخصية ومتابعة تقدم أبحاثك العلمية.</p>
                        </div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10" style={{ background: TURQUOISE }}></div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            ['l1', 'l2', 'l3', 'l4'].map(id => <div key={id} className="h-32 bg-gray-100 animate-pulse rounded-3xl"></div>)
                        ) : (
                            stats.map((stat) => (
                                <div key={stat.id} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-md transition-all"
                                    style={{ border: `1px solid ${TURQUOISE}15` }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">{stat.icon}</span>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${stat.color}15`, color: stat.color }}>محدث</span>
                                    </div>
                                    <h4 className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-widest">{stat.label}</h4>
                                    <p className="text-3xl font-black" style={{ color: PRUSSIAN }}>{stat.val}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden"
                        style={{ border: `1px solid ${TURQUOISE}20` }}>
                        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: `${TURQUOISE}15` }}>
                            <h3 className="font-bold text-lg" style={{ color: PRUSSIAN }}>سجل الأنشطة الحديثة</h3>
                            <button type="button" className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${TURQUOISE}15`, color: OCEAN }}>مشاهدة الكل</button>
                        </div>
                        <div className="divide-y" style={{ borderColor: `${TURQUOISE}10` }}>
                            {[1, 2, 3].map((item) => (
                                <div key={`act-${item}`} className="p-6 hover:bg-gray-50/50 transition flex items-center gap-5">
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
