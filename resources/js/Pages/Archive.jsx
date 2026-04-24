import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PRUSSIAN = '#003153';
const TURQUOISE = '#40E0D0';

export default function Archive() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({});

    const fetchArchive = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/archive?page=${page}&search=${search}`);
            setPapers(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error('Error fetching archive:', error);
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
        <div className="min-h-screen bg-gray-50 pb-20 font-['Cairo']">
            {/* Hero Section */}
            <div className="bg-[#001a2e] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #40E0D0 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">الأرشيف العلمي العام</h1>
                    <p className="text-xl text-gray-300 max-w-2xl">استكشف الأبحاث والنتائج العلمية المنشورة في مؤتمراتنا الدولية الموثقة.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 border border-gray-100">
                    <div className="flex-1 relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="البحث بالعنوان، اسم الباحث، أو الكلمات المفتاحية..."
                            className="w-full pr-12 pl-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-teal-500 outline-none transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-10 py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition shadow-lg shadow-teal-600/20">
                        بحث في الأرشيف
                    </button>
                </form>

                {/* Content */}
                <div className="mt-16">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                        </div>
                    ) : papers.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-gray-400">لا توجد أبحاث منشورة تطابق بحثك حالياً.</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {papers.map((paper) => (
                                <div key={paper.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            {paper.conference?.title.split(' ').slice(0, 3).join(' ')}...
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">#{paper.id}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-slate-900 mb-4 flex-1 line-clamp-3 leading-relaxed group-hover:text-teal-600 transition">
                                        {paper.title}
                                    </h3>

                                    <div className="space-y-4 pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                                {paper.author?.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold">الباحث الرئيسي</p>
                                                <p className="text-sm font-black text-slate-700">{paper.author?.full_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <div className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100">
                                                DOI: {paper.doi || 'N/A'}
                                            </div>
                                            <div className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100">
                                                Pages: {paper.page_numbers || 'N/A'}
                                            </div>
                                        </div>

                                        <a 
                                            href={`/storage_file/${paper.file_path}`} 
                                            target="_blank"
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-teal-600 transition shadow-lg"
                                        >
                                            <span>📥</span> تحميل نسخة البحث النهائية
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="mt-16 flex justify-center gap-2">
                            {[...Array(pagination.last_page)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => fetchArchive(i + 1)}
                                    className={`w-12 h-12 rounded-xl font-black transition ${pagination.current_page === i + 1 ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
