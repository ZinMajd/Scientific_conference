import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#105d82';
const PRUSSIAN_DARK = '#0a4a68';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Home() {
    const [stats, setStats] = useState({
        conferences: 4,
        papers: 32,
        users: 20
    });
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        axios.get('/api/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats", err));

        axios.get('/api/conferences')
            .then(res => setConferences(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error("Failed to fetch conferences", err));
    }, []);

    const getConferenceImage = (id, imageUrl) => {
        if (imageUrl && !imageUrl.includes('storage_file') && !imageUrl.includes('storage')) return imageUrl;
        const images = ['/images/conf_ai.png', '/images/conf_cyber.png', '/images/conf_innovation.png'];
        return images[(id - 1) % images.length];
    };

    return (
        <div className="pb-16 min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: PRUSSIAN_DARK }}>
                <div className="absolute inset-0 z-0">
                    <img src="/images/hero_conference.png" alt="University Conference" className="absolute inset-0 w-full h-full object-cover opacity-100" />
                    <div className="absolute inset-0 bg-[#001a2e]/40"></div>
                    <div className="absolute inset-0 bg-[#0096c7] mix-blend-multiply opacity-10"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white flex flex-col items-center">
                    <div className="max-w-4xl w-full">
                        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            نظام إدارة المؤتمرات
                            <br />
                            <span style={{ color: TURQUOISE }}>العلمية</span>
                        </h1>
                        <p className="text-xl text-white mx-auto leading-relaxed drop-shadow-md mb-6">
                            موقع متكامل لإدارة وتقديم الأوراق البحثية والتحكيم العلمي في مؤتمرات جامعة إقليم سبأ
                        </p>
                        <br />
                        <br />
                        <br />
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/conferences"
                                className="px-10 py-4 rounded-none font-black text-xl shadow-2xl transition-all duration-300 hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>
                                تصفح المؤتمرات ←
                            </Link>
                            <Link to="/register"
                                className="px-10 py-4 rounded-none font-bold text-xl transition-all duration-300 hover:scale-105"
                                style={{ background: 'rgba(255,255,255,0.1)', border: `2px solid ${TURQUOISE}60`, color: 'white', backdropFilter: 'blur(10px)' }}>
                                انضم إلينا الآن
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32"
                    style={{ background: 'linear-gradient(to top, white, transparent)' }}></div>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { count: `+${stats.conferences}`, label: 'مؤتمر نشط', icon: '🌍' },
                        { count: `+${stats.papers}`, label: 'ورقة بحثية', icon: '📄' },
                        { count: `+${stats.users}`, label: 'باحث ومحكّم', icon: '👨‍🎓' },
                    ].map((stat, idx) => (
                        <div key={idx} className="rounded-none p-8 flex items-center gap-6 hover:scale-105 transition-all duration-300 shadow-md"
                            style={{ background: 'white', border: `1px solid ${TURQUOISE}30` }}>
                            <div className="w-16 h-16 rounded-none flex items-center justify-center text-3xl shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className="text-4xl font-extrabold" style={{ color: PRUSSIAN }}>{stat.count}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Conferences */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b pb-6" style={{ borderColor: `${TURQUOISE}20` }}>
                    <div className="text-center md:text-right">
                        <h2 className="text-4xl font-black mb-2" style={{ color: PRUSSIAN }}>قائمة المؤتمرات</h2>
                        <div className="w-24 h-1.5 rounded-full mx-auto md:mx-0" style={{ background: TURQUOISE }}></div>
                    </div>
                    <Link to="/conferences"
                        className="px-6 py-3 rounded-none font-bold transition-all hover:scale-105"
                        style={{ border: `2px solid ${PRUSSIAN}`, color: PRUSSIAN }}>
                        عرض جميع المؤتمرات
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {(conferences.length > 0 ? conferences : [
                        { id: 1, title: 'الذكاء الاصطناعي في خدمة المجتمع', tag: '#تقنية_المعلومات', image_url: '/images/conf_ai.png', start_date: '2026-03-01', venue: 'مأرب، اليمن' },
                        { id: 2, title: 'مؤتمر اليمن للأمن السيبراني', tag: '#الأمن_السيبراني', image_url: '/images/conf_cyber.png', start_date: '2026-03-15', venue: 'مأرب، اليمن' },
                        { id: 3, title: 'ملتقى الابتكار الأكاديمي', tag: '#ابتكار', image_url: '/images/conf_innovation.png', start_date: '2026-03-20', venue: 'مأرب، اليمن' }
                    ]).map((item) => (
                        <Link 
                            key={item.id} 
                            to={`/conferences/${item.id}`}
                            className="group relative block overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:scale-105 rounded-none aspect-[3/4.2]"
                        >
                            <img 
                                src={getConferenceImage(item.id, item.image_url)} 
                                alt={item.title} 
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                            />
                            {/* Premium permanent overlay showing title and details at all times */}
                            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end min-h-[50%]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)' }}>
                                <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider mb-2">
                                    {item.tag || '#مؤتمر_علمي'}
                                </span>
                                <h3 className="text-base font-black text-white leading-snug mb-3 line-clamp-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
                                    {item.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-300 border-t pt-2.5 animate-fade-in" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                                    <span className="flex items-center gap-1 shrink-0">
                                        <span role="img" aria-label="date">📅</span>
                                        <span>{item.start_date ? new Date(item.start_date).toLocaleDateString('ar-YE') : 'مارس 2026'}</span>
                                    </span>
                                    <span className="flex items-center gap-1 line-clamp-1">
                                        <span role="img" aria-label="location">📍</span>
                                        <span>{item.venue || 'مأرب، اليمن'}</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
