import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/journal/announcements')
            .then(res => setAnnouncements(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
            <div className="min-h-screen bg-white font-['Cairo'] pb-20" dir="rtl">
             {/* Header */}
             <div className="border-b border-gray-100 py-4 px-6 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/archive" className="flex items-center gap-4 hover:opacity-80 transition">
                        <img src="/images/university_logo.gif" alt="جامعة إقليم سبأ" className="w-12 h-12 object-contain" />
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-none">جامعة إقليم سبأ</h1>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">نظام إدارة المؤتمرات العلمية</p>
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
                <h1 className="text-2xl font-black text-slate-900 mb-12">الإعلانات</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">لا توجد إعلانات منشورة بعد.</div>
                ) : (
                    <div className="space-y-12">
                        {announcements.map((item, idx) => (
                            <article key={idx} className="pb-12 border-b border-gray-100 last:border-none">
                                <p className="text-xs font-black text-teal-600 mb-2 uppercase tracking-widest">
                                    {new Date(item.publish_date || item.created_at).toLocaleDateString('ar-YE', {year: 'numeric', month: 'long', day: 'numeric'})}
                                </p>
                                <h2 className="text-lg font-black text-slate-800 mb-4 hover:text-red-700 transition cursor-pointer">{item.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.content}</p>
                                <Link to="#" className="text-xs font-black text-slate-400 hover:text-slate-800 transition uppercase tracking-widest">اقرأ المزيد ←</Link>
                            </article>
                        ))}
                    </div>
                )}
             </div>
            </div>
    );
}
