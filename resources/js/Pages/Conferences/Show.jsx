import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function Show() {
    const { id } = useParams();
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [regLoading, setRegLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Dropdown states
    const [editorialOpen, setEditorialOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
             try {
                const token = localStorage.getItem('token');
                const [confRes, regRes] = await Promise.all([
                    axios.get(`/api/conferences/${id}`),
                    token ? axios.get(`/api/conferences/${id}/check-registration`).catch(() => ({ data: { registered: false } })) : Promise.resolve({ data: { registered: false } })
                ]);
                setConference(confRes.data);
                setIsRegistered(regRes.data.registered);
             } catch (error) {
                console.error('Error fetching data:', error);
             } finally {
                setLoading(false);
             }
        };
        fetchData();
    }, [id]);

    const handleRegisterAttendance = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = `/login?redirect=/conferences/${id}`;
            return;
        }

        setRegLoading(true);
        try {
            await axios.post(`/api/conferences/${id}/register-attendance`);
            setIsRegistered(true);
            alert('تم التسجيل للحضور بنجاح!');
        } catch (error) {
            alert(error.response?.data?.message || 'فشل عملية التسجيل');
        } finally {
            setRegLoading(false);
        }
    };
    
    const handleRegisterPaper = (e) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            window.location.href = `/login?redirect=/researcher/research/create?confId=${id}`;
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse font-black text-slate-400 font-['Cairo']">جاري تحميل محتوى المؤتمر...</div>;
    if (!conference) return <div className="text-center py-20 font-black text-red-600 font-['Cairo']">عذراً، لم يتم العثور على المؤتمر</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20 flex flex-col items-center w-full" dir="rtl">
            {/* Top Navigation / Logo Bar */}
            <div className="w-full border-b border-gray-100 py-4 px-6 bg-white sticky top-0 z-50 shadow-sm flex justify-center">
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

            {/* Main Conference Info Section (Styled like Archive) */}
            <div className="w-full bg-white py-16 border-b border-gray-100 flex justify-center">
                <div className="w-[95%] max-w-5xl flex flex-col md:flex-row gap-12 items-start">
                    {/* Right: Conference Cover (Small) */}
                    <div className="w-full md:w-[240px] shrink-0">
                        <div className="bg-[#f2f2f2] p-8 shadow-lg border border-gray-200 flex flex-col items-center text-center">
                            <div className="w-full aspect-[3/4] mb-6 flex flex-col items-center justify-center text-white relative overflow-hidden bg-white">
                                {conference.image_path ? (
                                    <img src={`/storage_file/${conference.image_path}`} alt={conference.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4">
                                        <img src="/images/university_logo.gif" alt="جامعة إقليم سبأ" className="w-24 h-24 object-contain mb-4" />
                                        <h3 className="text-[10px] font-bold px-4 text-slate-800 leading-tight">{conference.title}</h3>
                                        <div className="w-12 h-0.5 bg-teal-400 mt-4"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Text */}
                    <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 mb-6 text-sm font-bold text-slate-600">
                            <span>الحالة:</span>
                            <span className="text-orange-500">🔓 تسجيل مفتوح</span>
                            <span className="text-emerald-500">✔</span>
                        </div>
                        <h2 className="text-3xl font-black mb-6" style={{ color: PRUSSIAN }}>{conference.title}</h2>
                        
                        <p className="text-lg leading-relaxed text-slate-700 mb-8 font-medium">
                            {conference.description || "يهدف المؤتمر لمناقشة تطبيقات الذكاء الاصطناعي في خدمة المجتمع والتنمية المستدامة في إقليم سبأ."}
                        </p>

                        <div className="space-y-4 mb-10 text-slate-700 font-bold text-base">
                            <p className="flex items-center gap-3"><span className="text-[8px] text-teal-600">■</span> المكان: {conference.venue || 'القاعة الكبرى - جامعة إقليم سبأ'}</p>
                            <p className="flex items-center gap-3"><span className="text-[8px] text-teal-600">■</span> التاريخ: {conference.start_date ? new Date(conference.start_date).toLocaleDateString('ar-YE', {year: 'numeric', month: 'long', day: 'numeric'}) : '٢٥ مارس ٢٠٢٦'}</p>
                            <p className="flex items-center gap-3"><span className="text-[8px] text-teal-600">■</span> اللغة: العربية/الإنجليزية</p>
                            <p className="flex items-center gap-3"><span className="text-[8px] text-teal-600">■</span> البريد الإلكتروني: {conference.contact_email || 'conference@sabauni.edu.ye'}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link 
                                to={`/researcher/research/create?confId=${id}`} 
                                onClick={handleRegisterPaper}
                                className="inline-block bg-[#a00000] text-white px-10 py-3 font-bold text-lg hover:bg-red-800 transition shadow-xl"
                            >
                                إرسال المخطوطة
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[95%] max-w-5xl text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">الأبحاث المقبولة في المؤتمر</h2>
                <div className="w-16 h-1 bg-slate-800 mx-auto mb-12"></div>
            </div>

            <div className="w-[95%] max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-12 justify-center">
                    {/* Right Content Area: Articles */}
                    <div className="lg:w-2/3">
                                    <div className="bg-white p-6 md:p-10 flex flex-col gap-16">
                                    {conference.papers.map((paper) => (
                                        <div key={paper.id} className="bg-gray-50 p-6 flex flex-col md:flex-row gap-8 transition-all duration-300">
                                            {/* Left Column: Small Thumbnail */}
                                            <div className="md:w-[150px] shrink-0 flex flex-col">
                                                <div 
                                                    className="w-full aspect-[3/4] bg-gray-200 mb-6 flex items-center justify-center overflow-hidden relative group cursor-zoom-in"
                                                    onClick={() => paper.thumbnail_path && setSelectedImage(`/storage_file/${paper.thumbnail_path}`)}
                                                >
                                                    {paper.thumbnail_path ? (
                                                        <>
                                                            <img 
                                                                src={`/storage_file/${paper.thumbnail_path}`} 
                                                                alt={paper.title} 
                                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                                        </>
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
                                                    <div className="w-px h-4 bg-gray-200 mx-auto"></div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-black text-slate-800 tracking-tighter uppercase leading-none">{paper.download_count || 0}</span>
                                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter leading-none">(التحميلات)</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="text-white px-10 py-5 rounded-none text-[14px] font-black uppercase tracking-widest" style={{ backgroundColor: '#a00000' }}>مقال</span>
                                                    <span className="text-white px-10 py-5 rounded-none text-[14px] font-black uppercase tracking-widest" style={{ backgroundColor: PRUSSIAN }}>رقم تعريف المقال : {paper.id}</span>
                                                </div>

                                                <Link to={`/article/${paper.id}`} className="group mb-4">
                                                    <h3 className="text-xl font-black leading-[1.2] transition-colors" style={{ color: '#0077a3' }} onMouseEnter={(e) => e.target.style.color = OCEAN} onMouseLeave={(e) => e.target.style.color = '#0077a3'}>
                                                        {paper.title}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-start gap-2 text-[13px] text-slate-500 mb-4 font-bold">
                                                    <span className="text-gray-400 mt-0.5">👤</span>
                                                    <div className="flex flex-wrap items-center">
                                                        <span className="text-gray-400 ml-2">بواسطة</span>
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
                                                    <span className="text-slate-800">DOI:</span>
                                                    <Link 
                                                        to={`/article/${paper.id}`}
                                                        className="hover:underline normal-case"
                                                        style={{ color: '#0077a3' }}
                                                    >
                                                        {paper.doi && paper.doi.startsWith('10.') ? `https://doi.org/${paper.doi}` : `https://doi.org/10.54963/jic.v5i1.${paper.id}`}
                                                    </Link>
                                                </div>

                                                <div className="text-sm text-slate-600 leading-relaxed mb-8 line-clamp-[7] font-medium border-r-4 border-slate-100 pr-4">
                                                    {paper.abstract}
                                                </div>

                                                <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-100">
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                await axios.post(`/api/article/${paper.id}/download-stat`);
                                                                // Update local state to show increment immediately
                                                                setConference(prev => ({
                                                                    ...prev,
                                                                    papers: prev.papers.map(p => 
                                                                        p.id === paper.id ? { ...p, download_count: (p.download_count || 0) + 1 } : p
                                                                    )
                                                                }));
                                                            } catch (e) { console.error(e); }
                                                            window.open(`/storage_file/${paper.final_file_path || paper.file_path}`, '_blank');
                                                        }}
                                                        className="flex items-center gap-3 text-xs font-black text-[#b30000] hover:text-red-600 transition-colors uppercase tracking-widest group"
                                                    >
                                                        <img 
                                                            src="/images/pdf_icon.png" 
                                                            alt="PDF" 
                                                            className="w-8 h-10 object-contain group-hover:scale-110 transition-transform" 
                                                        />
                                                        <span className="border-b-2 border-transparent hover:border-[#b30000] pb-0.5 transition-all">عرض ملف PDF</span>
                                                    </button>
                                                    <Link 
                                                        to={`/article/${paper.id}`} 
                                                        className="flex items-center gap-2 text-xs font-black transition-all group uppercase tracking-widest"
                                                        style={{ color: '#0077a3' }}
                                                        onMouseEnter={(e) => e.target.style.color = OCEAN}
                                                        onMouseLeave={(e) => e.target.style.color = '#0077a3'}
                                                    >
                                                        اقرأ المزيد 
                                                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    {/* Left Sidebar: Info (In RTL, second child is on the left) */}
                    <div className="lg:w-1/3 space-y-12 text-right">
                         <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 border-b-2 border-slate-800 w-fit pb-1">معلومات الموقع</h4>
                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                هذا المؤتمر هو جزء من شبكة السجلات العلمية (SCR)، مما يضمن جودة الأبحاث المحكمة وظهورها بنظام الوصول المفتوح لجميع الباحثين.
                            </p>
                        </div>

                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">المواعيد النهائية</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">تقديم الأبحاث</span>
                                    <span style={{ color: OCEAN }}>{new Date(conference.submission_deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">إشعار القبول</span>
                                    <span>{new Date(conference.notification_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Floating Preview (Non-blocking) */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500"
                >
                    <div 
                        className="relative max-w-xl max-h-[70vh] flex items-center justify-center animate-in zoom-in-95 fade-in duration-500 pointer-events-auto"
                    >
                        <button 
                            className="absolute -top-4 -right-4 z-[110] text-white bg-red-700 hover:bg-red-800 text-xl w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <div className="cursor-zoom-out" onClick={() => setSelectedImage(null)}>
                            <img 
                                src={selectedImage} 
                                alt="Research Detail" 
                                className="max-w-full max-h-full object-contain shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-none border border-gray-200 bg-white" 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
