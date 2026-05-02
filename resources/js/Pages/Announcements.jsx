import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editorialOpen, setEditorialOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/journal/announcements')
            .then(res => setAnnouncements(res.data))
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
                    <Link to="/topical-collection" className="hover:text-teal-400">مجموعة المواضيع</Link>

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

                    <Link to="/announcements" className="text-teal-400">الإعلانات</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">الإعلانات</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <h1 className="text-4xl font-black text-slate-900 mb-12 italic">Announcements</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">No announcements posted yet.</div>
                ) : (
                    <div className="space-y-12">
                        {announcements.map((item, idx) => (
                            <article key={idx} className="pb-12 border-b border-gray-100 last:border-none">
                                <p className="text-xs font-black text-teal-600 mb-2 uppercase tracking-widest">
                                    {new Date(item.publish_date || item.created_at).toLocaleDateString()}
                                </p>
                                <h2 className="text-2xl font-black text-slate-800 mb-4 hover:text-red-700 transition cursor-pointer">{item.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.content}</p>
                                <Link to="#" className="text-xs font-black text-slate-400 hover:text-slate-800 transition uppercase tracking-widest">Read More →</Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
