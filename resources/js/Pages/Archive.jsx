import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Archive() {
    const [papers, setPapers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    
    // Dropdown states
    const [editorialOpen, setEditorialOpen] = useState(false);

    const fetchArchive = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const [papersRes, announcementsRes] = await Promise.all([
                axios.get(`/api/archive?page=${page}&search=${search}`),
                axios.get('/api/journal/announcements')
            ]);
            setPapers(papersRes.data.data);
            setPagination(papersRes.data);
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error('حدث خطأ أثناء جلب البيانات:', error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchArchive();
    }, [fetchArchive]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArchive(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20 flex flex-col items-center w-full" dir="rtl">
            <div className="w-full border-b border-gray-100 py-4 px-4 md:px-16 lg:px-48 bg-white sticky top-0 z-50 shadow-sm flex justify-center">
                <div className="w-full max-w-5xl flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <img src="/images/university_logo.gif" alt="جامعة إقليم سبأ" className="w-12 h-12 object-contain" />
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">جامعة إقليم سبأ</h1>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">نظام إدارة المؤتمرات العلمية</p>
                        </div>
                    </Link>
                </div>
            </div>



            {/* Journal Header Banner */}
            <div className="w-full relative py-12 px-4 md:px-16 lg:px-48 overflow-hidden flex justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}></div>
                </div>
                <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="text-white text-right">
                        <div className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(64, 224, 208, 0.1)', border: `1px solid ${TURQUOISE}4d`, color: TURQUOISE }}>
                            منشور • ٢٠٢٦
                        </div>
                        <h2 className="text-4xl font-black mb-2 tracking-tighter">السجلات العلمية</h2>
                        <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-6">الأرشيف العلمي العام</p>
                        <p className="text-white/60 text-xs leading-relaxed max-w-xl font-medium">
                            تصفح الأبحاث المنشورة في مؤتمراتنا الدولية. السجل العلمي هو أرشيف دولي محكم ومفتوح الوصول يعزز التبادل الأكاديمي والابتكار التكنولوجي.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">
                            <span>اللغة: العربية / الإنجليزية</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full py-8 border-b border-gray-100 bg-white flex justify-center">
                <div className="w-full max-w-5xl flex flex-wrap flex-row gap-16 text-[17px] font-black items-center text-black px-6">
                    <Link to="/announcements" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">الإعلانات</Link>
                    <div className="relative group" onMouseEnter={() => setEditorialOpen(true)} onMouseLeave={() => setEditorialOpen(false)}>
                        <button className="flex items-center gap-1 hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">
                            فريق التحرير <span className="text-[10px]">▼</span>
                        </button>
                        {editorialOpen && (
                            <div className="absolute top-full right-0 w-48 bg-white shadow-xl border border-gray-100 py-2 mt-0 z-50 text-right">
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition font-bold">الأعضاء</Link>
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition font-bold">المستشارون</Link>
                            </div>
                        )}
                    </div>
                    <Link to="/topical-collection" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">مجموعة المواضيع</Link>
                    <Link to="/submissions" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">إرشادات التقديم</Link>
                    <Link to="/about" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">عن</Link>
                    <Link to="/archive" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">أرشيف</Link>
                </div>
            </div>

            {/* Main Journal Info Header (As per image) */}
            <div className="w-full bg-white py-16 border-b border-gray-100 flex justify-center">
                <div className="w-[95%] max-w-5xl flex flex-col md:flex-row gap-12 items-start">
                    {/* Right: Journal Cover (Small) */}
                    <div className="w-full md:w-[240px] shrink-0">
                        <div className="bg-[#f2f2f2] p-8 shadow-lg border border-gray-200 flex flex-col items-center text-center">
                            <div className="w-full aspect-[3/4] mb-6 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden bg-white">
                                <img src="/images/university_logo.gif" alt="جامعة إقليم سبأ" className="w-24 h-24 object-contain mb-6" />
                                <h1 className="text-base font-bold mb-2 text-slate-800">جامعة إقليم سبأ</h1>
                                <div className="w-12 h-0.5 bg-teal-400 mt-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Text */}
                    <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 mb-6 text-sm font-bold text-slate-600">
                            <span>الوصول:</span>
                            <span className="text-orange-500">🔓 وصول مفتوح كامل</span>
                            <span className="text-emerald-500">✔</span>
                        </div>
                        
                        <p className="text-lg leading-relaxed text-slate-700 mb-8 font-medium">
                            موقع جامعة إقليم سبأ للمؤتمرات العلمية مخصص لنشر وتوثيق الأبحاث العلمية المتميزة. يهدف الموقع إلى تعزيز البحث العلمي والتبادل الأكاديمي عبر توفير أرشيف رقمي متكامل لجميع المؤتمرات التي تنظمها الجامعة.
                        </p>

                        <div className="space-y-4 mb-10 text-slate-700 font-bold text-base">
                            <p className="flex items-center justify-end gap-3">المكان: جامعة إقليم سبأ - اليمن <span className="text-[8px] text-teal-600">■</span></p>
                            <p className="flex items-center justify-end gap-3">التكرار: دوري <span className="text-[8px] text-teal-600">■</span></p>
                            <p className="flex items-center justify-end gap-3">اللغة: العربية/الإنجليزية <span className="text-[8px] text-teal-600">■</span></p>
                            <p className="flex items-center justify-end gap-3">research@sabauni.edu.ye :البريد الإلكتروني <span className="text-[8px] text-teal-600">■</span></p>
                        </div>

                        <Link to="/login" className="inline-block bg-[#a00000] text-white px-10 py-3 font-bold text-lg hover:bg-red-800 transition shadow-xl">
                            إرسال المخطوطة
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-[95%] max-w-5xl px-6 mt-16 text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">أحدث المقالات المنشورة</h2>
                <div className="w-16 h-1 bg-slate-800 mx-auto mb-12"></div>
            </div>

            <div className="w-[95%] max-w-5xl px-6">
                <div className="flex flex-col lg:flex-row gap-12 justify-center">
                    {/* Main Content Area: Articles (Right side in RTL) */}
                    <div className="lg:w-2/3">
                        <div className="mb-10 flex justify-between items-center border-b border-gray-100 pb-4 text-right">
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">أحدث الأبحاث</h3>
                            <form onSubmit={handleSearch} className="relative group w-full max-w-sm">
                                <input 
                                    type="text" 
                                    placeholder="ابحث عن أبحاث..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-red-700 text-right"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            </form>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-700"></div>
                            </div>
                        ) : papers.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">لم يتم العثور على أبحاث في الأرشيف حالياً.</div>
                        ) : (
                        <div className="bg-slate-50 p-6 md:p-10 rounded-sm flex flex-col gap-16">
                                    {papers.map((paper) => (
                                        <div key={paper.id} className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row gap-8 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-sm">
                                            {/* Left Column: Small Thumbnail */}
                                            <div className="md:w-[150px] shrink-0 flex flex-col">
                                                <div 
                                                    className="w-full aspect-[3/4] bg-white border border-gray-200 shadow-inner mb-6 flex items-center justify-center overflow-hidden relative group cursor-zoom-in"
                                                    onClick={() => paper.thumbnail_path && setSelectedImage(`/storage_file/${paper.thumbnail_path}`)}
                                                >
                                                    {paper.thumbnail_path ? (
                                                        <img 
                                                            src={`/storage_file/${paper.thumbnail_path}`} 
                                                            alt={paper.title} 
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                        />
                                                    ) : (
                                                        <div className="p-6 text-[7px] text-gray-300 leading-tight select-none">
                                                            <div className="h-1.5 bg-gray-200 w-3/4 mb-2"></div>
                                                            <div className="h-1.5 bg-gray-100 w-full mb-2"></div>
                                                            <div className="h-1.5 bg-gray-100 w-full mb-3"></div>
                                                            <div className="h-32 bg-gray-50 w-full mb-4 border border-gray-100 flex items-center justify-center">
                                                                <span className="text-[20px] opacity-10">SCR</span>
                                                            </div>
                                                            <div className="h-1.5 bg-gray-100 w-full mb-2"></div>
                                                            <div className="h-1.5 bg-gray-100 w-full mb-2"></div>
                                                            <div className="h-1.5 bg-gray-100 w-2/3"></div>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                            <span className="text-lg">🔍</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3 px-1">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-black text-slate-800 tracking-tighter uppercase leading-none">{paper.view_count || 0}</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none">(المشاهدات)</span>
                                                    </div>
                                                    <div className="w-px h-4 bg-gray-100"></div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-black text-slate-800 tracking-tighter uppercase leading-none">{paper.download_count || 0}</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none">(التحميلات)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="bg-red-700 text-white px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest">مقال</span>
                                                    <span className="bg-slate-800 text-white px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest">معرف المقال: {paper.id}</span>
                                                </div>

                                                <Link to={`/article/${paper.id}`} className="group mb-4">
                                                    <h3 className="text-xl font-black leading-[1.2] transition-colors" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>
                                                        {paper.title}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-start gap-2 text-[13px] text-slate-500 mb-4 font-bold">
                                                    <span className="text-gray-400 mt-0.5">👤</span>
                                                    <div className="flex flex-wrap items-center">
                                                        <span className="text-gray-400 mr-2">بواسطة</span>
                                                        <span className="text-slate-700">{paper.author?.full_name}</span>
                                                        {paper.coauthors?.map((co, idx) => (
                                                            <span key={idx} className="flex items-center">
                                                                <span className="mx-1 text-gray-300">،</span>
                                                                <span className="text-slate-700">{co.full_name || co}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                                    <span>المجلد {paper.volume || 5}</span>
                                                    <span>العدد {paper.issue || 1}</span>
                                                    <span>({paper.conference?.start_date ? new Date(paper.conference.start_date).getFullYear() : 2026}).</span>
                                                    <span className="text-slate-800">DOI:</span>
                                                    <a 
                                                        href={paper.doi?.startsWith('10.') ? `https://doi.org/${paper.doi}` : `https://doi.org/10.54963/jic.v5i1.${paper.id}`} 
                                                        target="_blank" 
                                                        className="hover:underline normal-case"
                                                        style={{ color: OCEAN }}
                                                    >
                                                        {paper.doi && paper.doi.startsWith('10.') ? `https://doi.org/${paper.doi}` : `https://doi.org/10.54963/jic.v5i1.${paper.id}`}
                                                    </a>
                                                </div>

                                                <div className="text-sm text-slate-600 leading-relaxed mb-8 line-clamp-4 font-medium italic border-l-4 border-slate-100 pl-4">
                                                    {paper.abstract}
                                                </div>

                                                <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-100">
                                                    <button 
                                                        onClick={() => window.open(`/storage_file/${paper.file_path}`, '_blank')}
                                                        className="flex items-center gap-3 text-xs font-black text-[#8b0000] hover:text-red-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        <span className="text-2xl leading-none">📕</span>
                                                        <span className="border-b-2 border-transparent hover:border-[#8b0000] pb-0.5">قراءة PDF</span>
                                                    </button>
                                                    <Link 
                                                        to={`/article/${paper.id}`} 
                                                        className="flex items-center gap-2 text-xs font-black text-slate-800 transition-all group uppercase tracking-widest"
                                                        onMouseEnter={(e) => e.target.style.color = OCEAN}
                                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                    >
                                                        اقرأ المزيد 
                                                        <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        )}

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="mt-20 border-t border-gray-100 pt-8 flex justify-center gap-2">
                                {[...Array(pagination.last_page)].map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => fetchArchive(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center text-xs font-black rounded-sm border ${pagination.current_page === i + 1 ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-gray-100 transition'}`}
                                        style={pagination.current_page !== i + 1 ? { color: OCEAN } : {}}
                                        onMouseEnter={(e) => {if(pagination.current_page !== i + 1) e.target.style.color = OCEAN;}}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Left Sidebar: Info (In RTL, second child is on the left) */}
                    <div className="lg:w-1/3 space-y-12 text-right">
                        {/* Search Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 border-b-2 border-slate-800 w-fit pb-1">بحث</h4>
                            <form onSubmit={handleSearch} className="relative">
                                <input 
                                    type="text" 
                                    placeholder="ابحث هنا..." 
                                    className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-red-700 text-right" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2">🔍</button>
                            </form>
                        </div>

                        {/* Announcements Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">الإعلانات</h4>
                            <div className="space-y-6">
                                {announcements.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <Link to="/announcements" className="text-sm font-bold text-slate-700 group-hover:text-red-700 transition leading-snug">{item.title}</Link>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2">{new Date(item.publish_date || item.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                                {announcements.length === 0 && <p className="text-xs italic text-gray-400">لا توجد إعلانات حالية.</p>}
                            </div>
                        </div>

                        {/* Information Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">معلومات</h4>
                            <div className="space-y-4">
                                <Link to="/support" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">للقراء</Link>
                                <Link to="/submissions" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">للمؤلفين</Link>
                                <Link to="/support" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">للمكتبات</Link>
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">اللغة</h4>
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black text-red-700 border-b-2 border-red-700 pb-0.5">English</button>
                                <button className="text-[10px] font-bold text-gray-400 hover:text-slate-800 transition">العربية</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12 cursor-zoom-out animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white text-4xl hover:scale-110 transition"
                        onClick={() => setSelectedImage(null)}
                    >
                        &times;
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Research Detail" 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300" 
                    />
                </div>
            )}
        </div>
    );
}
