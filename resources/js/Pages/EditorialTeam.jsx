import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function EditorialTeam() {
    const [team, setTeam] = useState({
        editors_in_chief: [],
        editors: [],
        committee: []
    });
    const [loading, setLoading] = useState(true);
    const [editorialOpen, setEditorialOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/journal/editorial-team')
            .then(res => setTeam(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const EditorCard = ({ editor }) => (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-sm bg-slate-900 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                {editor.full_name.charAt(0)}
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-800 hover:text-red-700 transition cursor-pointer">{editor.full_name}</h3>
                <p className="text-sm font-bold text-slate-600 mb-2">{editor.affiliation || 'University of Saba Region'}</p>
                <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-xl">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px] block mb-1">Role</span>
                    {editor.user_type === 'chair' ? 'Editor-in-Chief' : editor.user_type === 'editor' ? 'Editor' : 'Scientific Committee'}
                </p>
                {editor.bio && <p className="text-xs text-gray-500 mt-2 italic">{editor.bio}</p>}
            </div>
        </div>
    );

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
                        <button className="flex items-center gap-1 text-teal-400 uppercase">
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
                    <span className="text-slate-800 font-black">هيئة التحرير</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <h1 className="text-4xl font-black text-slate-900 mb-12 italic">Editorial Team</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
                    </div>
                ) : (
                    <>
                        {team.editors_in_chief.length > 0 && (
                            <section className="mb-20">
                                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-10 border-b border-gray-100 pb-2">Editor-in-Chief</h2>
                                <div className="space-y-12">
                                    {team.editors_in_chief.map((editor, idx) => (
                                        <EditorCard key={idx} editor={editor} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {team.editors.length > 0 && (
                            <section className="mb-20">
                                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-10 border-b border-gray-100 pb-2">Editors</h2>
                                <div className="space-y-12">
                                    {team.editors.map((editor, idx) => (
                                        <EditorCard key={idx} editor={editor} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {team.committee.length > 0 && (
                            <section className="mb-20">
                                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-10 border-b border-gray-100 pb-2">Scientific Committee</h2>
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                                    {team.committee.map((member, idx) => (
                                        <div key={idx} className="flex gap-6 items-start">
                                            <div className="w-16 h-16 rounded-sm bg-gray-100 flex items-center justify-center text-gray-300 text-2xl font-black">
                                                {member.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-800">{member.full_name}</h3>
                                                <p className="text-xs font-bold text-gray-500">{member.affiliation || 'University of Saba Region'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
