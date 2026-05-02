import React, { useState, useEffect } from 'react';
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
    
    // Dropdown states
    const [editorialOpen, setEditorialOpen] = useState(false);

    const fetchArchive = async (page = 1) => {
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
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchive();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArchive(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20" dir="ltr">
            {/* Top Navigation / Logo Bar */}
            <div className="border-b border-gray-100 py-4 px-6 bg-white sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <div className="w-12 h-12 flex items-center justify-center text-white text-3xl font-black rounded-sm" style={{ background: PRUSSIAN_DARK }}>US</div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">UNIVERSITY OF SABA REGION</h1>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scientific Conference Management System</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
                        {/* Stay within journal section */}
                    </div>
                </div>
            </div>



            {/* Journal Header Banner */}
            <div className="relative py-12 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #001a2e 0%, #003153 60%, #0096c7 100%)` }}></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="text-white">
                        <div className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(64, 224, 208, 0.1)', border: '1px solid rgba(64, 224, 208, 0.3)', color: '#40E0D0' }}>
                            Published • 2026
                        </div>
                        <h2 className="text-4xl font-black mb-2 italic tracking-tighter">Scientific Records</h2>
                        <p className="text-white/70 text-sm font-bold tracking-widest uppercase mb-6">Public Scientific Archive</p>
                        <p className="text-white/60 text-xs leading-relaxed max-w-xl font-medium">
                            Browse research published in our international conferences. The SCR is a peer-reviewed, open-access international archive that fosters academic exchange and technological innovation.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-4 text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">
                            <span>ISSN: 2754-5792</span>
                            <span>|</span>
                            <span>Arabic / English</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Nav with Dropdowns */}
            <div className="text-white py-3 px-6 shadow-md relative z-40" style={{ background: '#003153' }}>
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-xs font-black uppercase tracking-wider items-center">
                    <Link to="/archive" className="transition" style={{ color: TURQUOISE }}>الأرشيف</Link>
                    <Link to="/submissions" className="hover:text-[#40E0D0] transition" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>إرشادات التقديم</Link>
                    <Link to="/topical-collection" className="hover:text-[#40E0D0] transition" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>مجموعة المواضيع</Link>

                    <div className="relative" onMouseEnter={() => setEditorialOpen(true)} onMouseLeave={() => setEditorialOpen(false)}>
                        <button className="flex items-center gap-1 transition uppercase" style={{ color: 'white' }} onMouseEnter={(e) => e.currentTarget.style.color = TURQUOISE} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                            هيئة التحرير <span className="text-[8px]">▼</span>
                        </button>
                        {editorialOpen && (
                            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 py-2 mt-0 z-50">
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Editorial Board</Link>
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Advisory Board</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/announcements" className="transition" style={{ color: 'white' }} onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>الإعلانات</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">الأرشيف</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8">


                {/* Journal Info Header Section */}
                <div className="flex flex-col lg:flex-row gap-12 mb-16 border-b border-gray-100 pb-12">
                    <div className="lg:w-3/4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-emerald-500">✔</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Access: Full</span>
                            <span className="text-orange-400 ml-4">🔓</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Open access</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-4 italic">Scientific Conference Records</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-3xl font-medium">
                            The Scientific Conference Records (SCR) is a peer-reviewed, open-access international journal that publishes high-quality research across various scientific disciplines. The journal aims to foster academic exchange and technological innovation through our global conference network.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-bold text-slate-600 mb-8">
                            <p>• ISSN: 2754-5792</p>
                            <p>• Frequency: Semiannually</p>
                            <p>• Language: Arabic/English</p>
                            <p>• E-mail: contact@sabauni.edu.ye</p>
                        </div>
                        <Link to="/login" className="inline-block px-8 py-3 font-black rounded-sm transition shadow-2xl hover:scale-105" style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}>Submit Manuscript</Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area */}
                    <div className="lg:w-3/4">
                        <div className="mb-10 flex justify-between items-center border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Current Articles</h3>
                            <form onSubmit={handleSearch} className="relative group w-full max-w-sm">
                                <input 
                                    type="text" 
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-red-700"
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
                            <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">No articles found in current archive.</div>
                        ) : (
                        <div className="lg:pl-20 space-y-16">
                                    {papers.map((paper) => (
                                        <div key={paper.id} className="bg-white border border-gray-200 p-8 shadow-md rounded-lg hover:shadow-xl transition-all duration-300">
                                            {/* Article Header: Title */}
                                            <Link to={`/article/${paper.id}`} className="group block mb-4">
                                                <h3 className="text-xl font-black text-slate-800 transition leading-tight mb-2" onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = '#1e293b'}>
                                                    {paper.title}
                                                </h3>
                                            </Link>

                                            {/* Authors Section */}
                                            <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600 mb-4 font-bold">
                                                <span className="text-gray-400">بقلم:</span>
                                                <span className="hover:text-[#0096c7] cursor-pointer transition-colors" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>{paper.author?.full_name}</span>
                                                {paper.coauthors?.map((co, idx) => (
                                                    <span key={idx} className="flex gap-x-2">
                                                        <span className="text-gray-300">،</span>
                                                        <span className="hover:text-[#0096c7] cursor-pointer transition-colors" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>{co.full_name || co}</span>
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Metadata: Volume, Issue, DOI */}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded-sm text-slate-600">المجلد {paper.volume || 5} العدد {paper.issue || 1} (2026)</span>
                                                <span className="text-gray-300">|</span>
                                                {paper.doi && paper.doi.startsWith('10.') ? (
                                                    <a href={`https://doi.org/${paper.doi}`} target="_blank" className="text-teal-600 hover:underline">DOI: https://doi.org/{paper.doi}</a>
                                                ) : (
                                                    <span className="text-gray-400 italic">DOI: {paper.doi && !paper.doi.includes('Paper ID') ? paper.doi : 'Pending / قيد التخصيص'}</span>
                                                )}
                                            </div>

                                            {/* Abstract Section */}
                                            <div className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-3 italic">
                                                {paper.abstract || "تقدم هذه الدراسة تحليلاً شاملاً للموضوع المختار، مع التركيز على القيود والتحديات والحلول المقترحة في سياق البحث العلمي الحديث..."}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-6">
                                                <Link to={`/article/${paper.id}`} className="flex items-center gap-2 text-xs font-black transition uppercase tracking-widest border-b-2 pb-0.5" style={{ color: PRUSSIAN_DARK, borderColor: PRUSSIAN_DARK }} onMouseEnter={(e) => {e.target.style.color = OCEAN; e.target.style.borderColor = OCEAN;}} onMouseLeave={(e) => {e.target.style.color = PRUSSIAN_DARK; e.target.style.borderColor = PRUSSIAN_DARK;}}>
                                                    اقرأ المزيد
                                                </Link>
                                                <button 
                                                    onClick={() => window.open(`/storage_file/${paper.file_path}`, '_blank')}
                                                    className="flex items-center gap-2 text-xs font-black transition px-6 py-2 rounded-sm shadow-md hover:scale-105"
                                                    style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}
                                                >
                                                    <span className="text-sm">📄</span>
                                                    عرض ملف PDF
                                                </button>
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

                    <div className="lg:w-1/4 space-y-12">
                        {/* Search Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Search</h4>
                            <div className="relative">
                                <input type="text" placeholder="Search..." className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-red-700" />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2">🔍</button>
                            </div>
                        </div>

                        {/* Announcements Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">Announcements</h4>
                            <div className="space-y-6">
                                {announcements.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <Link to="/announcements" className="text-sm font-bold text-slate-700 group-hover:text-red-700 transition leading-snug">{item.title}</Link>
                                        <p className="text-[10px] font-bold text-gray-400 mt-2">{new Date(item.publish_date || item.created_at).toLocaleDateString()}</p>
                                    </div>
                                ))}
                                {announcements.length === 0 && <p className="text-xs italic text-gray-400">No recent announcements.</p>}
                            </div>
                        </div>

                        {/* Information Sidebar */}
                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">Information</h4>
                            <div className="space-y-4">
                                <Link to="/support" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">For Readers</Link>
                                <Link to="/submissions" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">For Authors</Link>
                                <Link to="/support" className="block text-xs font-bold text-gray-400 hover:text-red-700 transition uppercase tracking-widest">For Librarians</Link>
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Language</h4>
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black text-red-700 border-b-2 border-red-700 pb-0.5">English</button>
                                <button className="text-[10px] font-bold text-gray-400 hover:text-slate-800 transition">العربية</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
