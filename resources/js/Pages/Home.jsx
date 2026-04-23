import React from 'react';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Home() {
    return (
        <div className="pb-16 min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/hero_conference.png" alt="Conference Hall"
                        className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}e6 0%, ${PRUSSIAN}cc 60%, ${OCEAN}99 100%)` }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <div className="inline-block mb-6 px-5 py-2 rounded-full text-sm font-bold"
                        style={{ background: `${TURQUOISE}25`, border: `1px solid ${TURQUOISE}50`, color: TURQUOISE }}>
                        ✦ منصة المؤتمرات العلمية الرسمية ✦
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 drop-shadow-2xl">
                        نظام إدارة المؤتمرات
                        <br />
                        <span style={{ color: TURQUOISE }}>العلمية</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                        منصة متكاملة لإدارة وتقديم الأوراق البحثية والتحكيم العلمي في مؤتمرات جامعة إقليم سبأ
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/conferences"
                            className="px-10 py-4 rounded-2xl font-black text-xl shadow-2xl transition-all duration-300 hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>
                            تصفح المؤتمرات ←
                        </Link>
                        <Link to="/register"
                            className="px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105"
                            style={{ background: 'rgba(255,255,255,0.1)', border: `2px solid ${TURQUOISE}60`, color: 'white', backdropFilter: 'blur(10px)' }}>
                            انضم إلينا الآن
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32"
                    style={{ background: 'linear-gradient(to top, white, transparent)' }}></div>
            </section>

            {/* Stats */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { count: '+150', label: 'مؤتمر نشط', icon: '🌍' },
                        { count: '+5000', label: 'ورقة بحثية', icon: '📄' },
                        { count: '+1200', label: 'باحث ومحكّم', icon: '👨‍🎓' },
                    ].map((stat, idx) => (
                        <div key={idx} className="rounded-3xl p-8 flex items-center gap-6 hover:scale-105 transition-all duration-300 shadow-md"
                            style={{ background: 'white', border: `1px solid ${TURQUOISE}30` }}>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
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
            <section className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="text-center md:text-right">
                        <h2 className="text-4xl font-black mb-2" style={{ color: PRUSSIAN }}>المؤتمرات المميزة</h2>
                        <div className="w-20 h-1 rounded-full mx-auto md:mx-0" style={{ background: TURQUOISE }}></div>
                    </div>
                    <Link to="/conferences"
                        className="px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
                        style={{ border: `2px solid ${PRUSSIAN}`, color: PRUSSIAN }}>
                        عرض جميع المؤتمرات
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { id: 1, title: 'الذكاء الاصطناعي في خدمة المجتمع', tag: '#تقنية_المعلومات', img: '/images/conf_ai.png' },
                        { id: 2, title: 'مؤتمر اليمن للأمن السيبراني', tag: '#الأمن_السيبراني', img: '/images/conf_cyber.png' },
                        { id: 3, title: 'ملتقى الابتكار الأكاديمي', tag: '#ابتكار', img: '/images/conf_innovation.png' },
                    ].map((item) => (
                        <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border flex flex-col"
                            style={{ borderColor: `${TURQUOISE}30` }}>
                            <div className="h-52 relative overflow-hidden" style={{ background: PRUSSIAN_DARK }}>
                                <img src={item.img} alt={item.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full"
                                    style={{ background: TURQUOISE, color: PRUSSIAN_DARK }}>
                                    متاح للتسجيل
                                </div>
                            </div>
                            <div className="p-7 grow flex flex-col">
                                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: OCEAN }}>{item.tag}</p>
                                <h3 className="text-lg font-bold mb-4 leading-snug" style={{ color: PRUSSIAN }}>{item.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 mt-auto">
                                    <span>📅 مارس 2026</span>
                                    <span className="border-r pr-4" style={{ borderColor: `${TURQUOISE}30` }}>📍 مأرب، اليمن</span>
                                </div>
                                <Link to={`/conferences/${item.id}`}
                                    className="block w-full text-center py-3 rounded-2xl font-bold transition-all duration-200 group-hover:scale-105"
                                    style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})`, color: 'white' }}>
                                    عرض التفاصيل والتسجيل
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
