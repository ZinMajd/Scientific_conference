import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TopicalCollection() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editorialOpen, setEditorialOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/journal/topical-collections')
            .then(res => setCollections(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white font-['Cairo'] pb-20" dir="ltr">
             {/* Header */}
             <div className="border-b border-gray-100 py-4 px-6 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white text-3xl font-black rounded-sm">US</div>
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

            {/* Secondary Nav with Dropdowns */}
            <div className="bg-slate-900 text-white py-3 px-6 shadow-md relative z-40">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-xs font-black uppercase tracking-wider items-center">
                    <Link to="/archive" className="hover:text-teal-400">الأرشيف</Link>
                    <Link to="/submissions" className="hover:text-teal-400">إرشادات التقديم</Link>
                    <Link to="/topical-collection" className="text-teal-400">مجموعة المواضيع</Link>

                    {/* Editorial Dropdown */}
                    <div className="relative" onMouseEnter={() => setEditorialOpen(true)} onMouseLeave={() => setEditorialOpen(false)}>
                        <button className="flex items-center gap-1 hover:text-teal-400 uppercase">
                            هيئة التحرير <span className="text-[8px]">▼</span>
                        </button>
                        {editorialOpen && (
                            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-gray-100 py-2 mt-0 z-50">
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 hover:text-teal-600 normal-case font-bold">Editorial Board</Link>
                                <Link to="/editorial-team" className="block px-4 py-2 text-slate-700 hover:bg-gray-50 hover:text-teal-600 normal-case font-bold">Advisory Board</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/announcements" className="hover:text-teal-400">الإعلانات</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">مجموعة المواضيع</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <h1 className="text-4xl font-black text-slate-900 mb-12 italic">Topical Collections</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">No active topical collections at this time.</div>
                ) : (
                    <div className="grid gap-12">
                        {collections.map((item, idx) => (
                            <div key={idx} className="p-10 bg-gray-50/50 rounded-sm border border-gray-100 hover:border-teal-200 transition relative overflow-hidden group">
                                <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase">Open for Submission</div>
                                <h2 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-red-700 transition">{item.title}</h2>
                                
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-sm">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] w-24">Deadline</span>
                                        <span className="font-black text-red-700">{new Date(item.submission_deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-sm">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] w-24">Venue</span>
                                        <span className="font-bold text-slate-500 italic">{item.venue}</span>
                                    </div>
                                </div>

                                <Link to={`/conferences/${item.id}`} className="inline-block px-8 py-3 bg-slate-900 text-white font-black text-xs rounded-sm hover:bg-red-700 transition shadow-lg">View Full Details & Submit</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
