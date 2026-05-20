import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TopicalCollection() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/journal/topical-collections')
            .then(res => setCollections(res.data))
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
                    <Link to="/topical-collection" className="text-teal-400">مجموعة المواضيع</Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-2 px-6">
                <div className="max-w-7xl mx-auto flex gap-2 text-[10px] font-bold text-gray-400 items-center uppercase tracking-widest">
                    <Link to="/archive" className="hover:text-slate-800">مركز المعلومات المشتركة</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-black">مجموعة المواضيع</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12">
                <h1 className="text-2xl font-black text-slate-900 mb-12">مجموعة المواضيع</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-900"></div>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-sm italic text-gray-400">لا توجد أوراق أو مواضيع علمية نشطة حالياً.</div>
                ) : (
                    <div className="grid gap-12">
                        {collections.map((item, idx) => (
                            <div key={idx} className="p-10 bg-white rounded-sm border border-gray-100 hover:border-teal-200 transition relative overflow-hidden group">
                                <div className="absolute top-0 left-0 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase">متاح لتقديم الأبحاث</div>
                                <h2 className="text-lg font-black text-slate-800 mb-6 group-hover:text-red-700 transition">{item.title}</h2>
                                
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-sm">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] w-24">آخر موعد للتقديم</span>
                                        <span className="font-black text-red-700">{new Date(item.submission_deadline).toLocaleDateString('ar-YE', {year: 'numeric', month: 'numeric', day: 'numeric'})}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-sm">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] w-24">مكان الانعقاد</span>
                                        <span className="font-bold text-slate-500 italic">{item.venue}</span>
                                    </div>
                                </div>

                                <Link to={`/conferences/${item.id}`} className="inline-block px-8 py-3 bg-slate-900 text-white font-black text-xs rounded-sm hover:bg-red-700 transition shadow-lg">عرض التفاصيل الكاملة والتقديم ←</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
