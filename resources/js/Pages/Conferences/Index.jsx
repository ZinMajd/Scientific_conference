import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Conferences() {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get('/api/conferences');
                setConferences(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Error fetching conferences:', err);
                setError('تعذّر تحميل المؤتمرات. يرجى المحاولة لاحقاً.');
            } finally {
                setLoading(false);
            }
        };
        fetchConferences();
    }, []);

    const getConferenceImage = (id, imageUrl) => {
        if (imageUrl && !imageUrl.includes('storage_file') && !imageUrl.includes('storage')) return imageUrl;
        const images = ['/images/conf_ai.png', '/images/conf_cyber.png', '/images/conf_innovation.png'];
        return images[(id - 1) % images.length];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
                    style={{ borderColor: `${TURQUOISE} transparent ${TURQUOISE} transparent` }}></div>
                <p style={{ color: PRUSSIAN }} className="font-bold text-lg">جاري تحميل المؤتمرات...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: '#f0fafa' }}>
            {/* Page Header */}
            <div className="py-12 px-4" style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                <div className="container mx-auto">
                    <h1 className="text-4xl font-black text-white mb-2">المؤتمرات المتاحة</h1>
                    <div className="w-20 h-1 rounded-full mb-4" style={{ background: TURQUOISE }}></div>
                    <p className="text-white/70 text-lg">اكتشف المؤتمرات العلمية المفتوحة للتسجيل وتقديم الأوراق البحثية</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                {error && (
                    <div className="mb-8 p-5 rounded-2xl text-center border"
                        style={{ background: '#fff0f0', borderColor: '#ffcccc', color: '#c00' }}>
                        <p className="font-bold text-lg">⚠️ {error}</p>
                    </div>
                )}

                {!error && conferences.length === 0 && (
                    <div className="text-center py-24">
                        <div className="text-8xl mb-6">🔭</div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: PRUSSIAN }}>لا توجد مؤتمرات متاحة حالياً</h2>
                        <p className="text-gray-500 mb-8">سيتم إضافة مؤتمرات قريباً، تابعنا للاطلاع على آخر الأخبار</p>
                        <Link to="/" className="px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                            العودة للرئيسية
                        </Link>
                    </div>
                )}

                <div className="grid gap-6">
                    {conferences.map((item) => (
                        <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col md:flex-row"
                            style={{ borderColor: `${TURQUOISE}30` }}>
                            <div className="w-full md:w-64 h-52 shrink-0 overflow-hidden relative"
                                style={{ background: PRUSSIAN_DARK }}>
                                <img src={getConferenceImage(item.id, item.image_url)} alt={item.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                                    style={{
                                        background: item.status === 'open' || item.status === 'reviewing' ? `${TURQUOISE}` : '#ef4444',
                                        color: item.status === 'open' || item.status === 'reviewing' ? PRUSSIAN_DARK : 'white'
                                    }}>
                                    {item.status === 'open' || item.status === 'reviewing' ? '✓ متاح للتسجيل' : 'منتهي'}
                                </div>
                            </div>
                            <div className="grow p-8 flex flex-col">
                                <div className="mb-3">
                                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                                        style={{ background: `${TURQUOISE}20`, color: OCEAN }}>
                                        #مؤتمر_علمي
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black mb-3 group-hover:transition-colors"
                                    style={{ color: PRUSSIAN }}>
                                    {item.title}
                                </h2>
                                <p className="text-gray-500 mb-6 leading-relaxed line-clamp-2 pr-4 border-r-2"
                                    style={{ borderColor: `${TURQUOISE}50` }}>
                                    {item.description}
                                </p>
                                <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-t pt-4 mt-auto"
                                    style={{ borderColor: `${TURQUOISE}20` }}>
                                    <span className="flex items-center gap-2">
                                        <span style={{ color: OCEAN }}>📅</span>
                                        التاريخ: {item.start_date ? new Date(item.start_date).toLocaleDateString('ar-YE') : 'غير محدد'}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span style={{ color: OCEAN }}>📍</span>
                                        المكان: {item.venue || 'غير محدد'}
                                    </span>
                                </div>
                                <div className="mt-5 flex justify-end">
                                    <Link to={`/conferences/${item.id}`}
                                        className="px-7 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105"
                                        style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                                        عرض التفاصيل والتسجيل ←
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
