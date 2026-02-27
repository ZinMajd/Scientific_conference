import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="pb-16 min-h-screen bg-white">
            {/* Professional Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                {/* Background Visual */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/hero_conference.png" 
                        alt="Conference Hall" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-950/80"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-12">
                    {/* Text removed as per user request to allow background image text to show clearly */}
                        <div className="flex flex-wrap gap-6 justify-center pt-32">
                            <Link to="/conferences" className="px-10 py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl font-bold text-xl shadow-2xl transition-all scale-110">
                                تصفح المؤتمرات
                            </Link>
                            <Link to="/register" className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl font-bold text-xl transition-all">
                                انضم إلينا الآن
                            </Link>
                        </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white to-transparent"></div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { count: '+150', label: 'مؤتمر نشط', icon: '🌍' },
                        { count: '+5000', label: 'ورقة بحثية', icon: '📄' },
                        { count: '+1200', label: 'باحث ومحكّم', icon: '👨‍🎓' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-3xl p-10 flex items-center gap-8 border border-gray-100 transform hover:scale-105 transition-all">
                            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-blue-600/20">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className="text-4xl font-extrabold text-blue-950">{stat.count}</h3>
                                <p className="text-gray-500 font-medium tracking-wide">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Conferences Header */}
            <section className="container mx-auto px-4 pt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-right">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">المؤتمرات المميزة</h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto md:mx-0 rounded-full"></div>
                    </div>
                    <Link to="/conferences" className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all">
                        عرض جميع المؤتمرات
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { 
                            id: 1, 
                            title: 'الذكاء الاصطناعي في خدمة المجتمع', 
                            tag: '#تقنية_المعلومات', 
                            img: '/images/conf_ai.png'
                        },
                        { 
                            id: 2, 
                            title: 'مؤتمر اليمن للأمن السيبراني', 
                            tag: '#الأمن_السيبراني', 
                            img: '/images/conf_cyber.png'
                        },
                        { 
                            id: 3, 
                            title: 'ملتقى الابتكار الأكاديمي', 
                            tag: '#ابتكار', 
                            img: '/images/conf_innovation.png'
                        },
                    ].map((item) => (
                        <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 flex flex-col">
                             <div className="h-56 bg-blue-900 relative overflow-hidden">
                                 <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                 <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    متاح للتسجيل
                                 </div>
                             </div>
                             <div className="p-8 grow flex flex-col">
                                <p className="text-blue-600 font-bold text-sm mb-3 uppercase tracking-wider">{item.tag}</p>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors leading-snug">{item.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 mt-auto">
                                    <span className="flex items-center gap-1">📅 مارس 2026</span>
                                    <span className="flex items-center gap-2 pr-4 border-r border-gray-200">📍 مأرب، اليمن</span>
                                </div>
                                <Link to={`/conferences/${item.id}`} className="block w-full text-center py-4 bg-gray-50 border border-gray-100 text-blue-950 rounded-2xl font-bold group-hover:bg-blue-900 group-hover:text-white transition-all shadow-sm">
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
