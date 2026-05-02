import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function ArticleView() {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editorialOpen, setEditorialOpen] = useState(false);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const response = await axios.get(`/api/article/${id}`);
                setPaper(response.data);
            } catch (error) {
                console.error('Error fetching paper:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaper();
    }, [id]);

    const handleDownload = async () => {
        try {
            await axios.post(`/api/article/${id}/download-stat`);
            window.open(`/storage_file/${paper.file_path}`, '_blank');
        } catch (error) {
            console.error('Error recording download:', error);
            window.open(`/storage_file/${paper.file_path}`, '_blank');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-['Cairo']">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900"></div>
        </div>
    );

    if (!paper) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Cairo']">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
                <Link to="/archive" className="text-teal-600 hover:underline">Back to Archive</Link>
            </div>
        </div>
    );

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
                </div>
            </div>

            {/* Header Banner */}
            <div className="relative py-12 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                     <div className="inline-block mb-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(64, 224, 208, 0.1)', border: '1px solid rgba(64, 224, 208, 0.3)', color: TURQUOISE }}>
                        Full Research Paper
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl font-black italic tracking-tighter leading-tight max-w-4xl">
                        {paper.title}
                    </h2>
                </div>
            </div>

            {/* Secondary Nav with Dropdowns */}
            <div className="text-white py-3 px-6 shadow-md relative z-40" style={{ background: PRUSSIAN }}>
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-xs font-black uppercase tracking-wider items-center">
                    <Link to="/archive" className="transition hover:text-[#40E0D0]" style={{ color: 'white' }}>الأرشيف</Link>
                    <Link to="/submissions" className="transition hover:text-[#40E0D0]" style={{ color: 'white' }}>إرشادات التقديم</Link>
                    <Link to="/topical-collection" className="transition hover:text-[#40E0D0]" style={{ color: 'white' }}>مجموعة المواضيع</Link>

                    <div className="relative" onMouseEnter={() => setEditorialOpen(true)} onMouseLeave={() => setEditorialOpen(false)}>
                        <button className="flex items-center gap-1 transition uppercase" style={{ color: 'white' }}>
                            هيئة التحرير <span className="text-[8px]">▼</span>
                        </button>
                        {editorialOpen && (
                            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 py-2 mt-0 z-50">
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Editorial Board</Link>
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 transition normal-case font-bold" style={{ color: PRUSSIAN }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = PRUSSIAN}>Advisory Board</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/announcements" className="transition hover:text-[#40E0D0]" style={{ color: 'white' }}>الإعلانات</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <Link to="/archive" className="hover:text-slate-800">الأرشيف</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black truncate max-w-xs">{paper.title}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content Area */}
                    <div className="lg:w-3/4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold text-sm">بقلم:</span>
                                <span className="text-slate-800 font-black text-sm" style={{ color: PRUSSIAN }}>{paper.author?.full_name}</span>
                            </div>
                            {paper.coauthors?.map((co, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="text-gray-300">،</span>
                                    <span className="text-slate-800 font-black text-sm" style={{ color: PRUSSIAN }}>{co.full_name || co}</span>
                                </div>
                            ))}
                        </div>

                        {/* Abstract */}
                        <section className="mb-12">
                            <h3 className="text-xl font-black text-slate-800 mb-6 border-b-2 border-slate-800 w-fit pb-1">الخلاصة (Abstract)</h3>
                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-lg text-justify whitespace-pre-line bg-white p-10 rounded-sm italic border-r-4 border-slate-200 shadow-sm">
                                {paper.abstract}
                            </div>
                        </section>

                        {/* DOI and Citation Info */}
                        <section className="mb-12 p-8 text-white rounded-sm shadow-xl" style={{ background: PRUSSIAN_DARK }}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: TURQUOISE }}>معرف الكائن الرقمي (DOI)</h4>
                                    {paper.doi && paper.doi.startsWith('10.') ? (
                                        <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="text-xl font-black transition break-all" onMouseEnter={(e) => e.target.style.color = TURQUOISE} onMouseLeave={(e) => e.target.style.color = 'white'}>
                                            https://doi.org/{paper.doi}
                                        </a>
                                    ) : (
                                        <p className="text-xl font-black text-gray-400 italic">DOI: Pending / قيد التخصيص</p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: TURQUOISE }}>الكلمات المفتاحية</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {paper.keywords?.split(',').map((k, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-sm border border-white/10 italic">
                                                #{k.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* References */}
                        <section>
                            <h3 className="text-xl font-black text-slate-800 mb-6 border-b-2 border-slate-800 w-fit pb-1">المراجع (References)</h3>
                            <div className="space-y-4 text-xs text-gray-500 font-bold leading-relaxed">
                                <p>[1] Al-Wajeeh, M. S., et al. (2026). "Cognitive Password Systematic Review: Limitations, Challenges, and Solutions." University of Saba Region Scientific Conference Records.</p>
                                <p>[2] Smith, J., & Doe, A. (2025). "Advanced Authentication Mechanisms." International Journal of Cybersecurity, 12(3), 45-67.</p>
                                <p>[3] IEEE Standard for Biometric Authentication (2024). IEEE Std 1452-2024.</p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:w-1/4 space-y-10">
                        {/* Download PDF Button */}
                        <button 
                            onClick={handleDownload}
                            className="w-full py-4 font-black rounded-sm transition shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}
                        >
                            <span className="text-xl">📄</span> عرض ملف PDF
                        </button>

                        {/* Issue Details Card */}
                        <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">العدد الحالي</h4>
                            <div className="flex gap-4 items-start mb-4">
                                <div className="w-16 h-20 flex-shrink-0 flex items-center justify-center text-white font-black text-xs p-2 text-center leading-none rounded-sm" style={{ background: PRUSSIAN_DARK }}>
                                    SCR 2026
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">المجلد {paper.volume || 5} العدد {paper.issue || 1} (2026)</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">{paper.conference?.title}</p>
                                </div>
                            </div>
                            <Link to="/archive" className="block text-center text-[10px] font-black hover:underline uppercase tracking-widest" style={{ color: OCEAN }}>عرض جميع أبحاث العدد</Link>
                        </div>

                        {/* License */}
                        <div className="p-4 border border-teal-100 bg-teal-50/30 rounded-sm">
                            <div className="flex gap-3 items-center mb-3">
                                <span className="text-teal-600 text-xl">🔓</span>
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">الوصول الحر (Open Access)</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                                هذا العمل مرخص بموجب رخصة المشاع الإبداعي (Creative Commons Attribution 4.0 International License).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
