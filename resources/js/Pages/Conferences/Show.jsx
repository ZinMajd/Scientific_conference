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
            alert('Registered as attendance successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
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

    if (loading) return <div className="text-center py-20 animate-pulse font-black text-slate-400 font-['Cairo']">Loading Journal Content...</div>;
    if (!conference) return <div className="text-center py-20 font-black text-red-600 font-['Cairo']">Journal/Conference Not Found</div>;

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

            {/* Secondary Nav with Dropdowns */}
            <div className="text-white py-3 px-6 shadow-md relative z-40 mb-8" style={{ background: PRUSSIAN }}>
                <div className="max-w-7xl mx-auto flex flex-wrap gap-8 text-xs font-black uppercase tracking-wider items-center">
                    <Link to="/archive" className="transition hover:text-[#40E0D0]" style={{ color: TURQUOISE }}>JIC</Link>
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

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 mb-16 border-b border-gray-100 pb-12">
                    <div className="lg:w-1/4">
                        <div className="p-8 text-white rounded-sm shadow-2xl relative overflow-hidden group" style={{ background: PRUSSIAN_DARK }}>
                            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent"></div>
                            <p className="text-[10px] font-bold mb-2 opacity-60">Published • {new Date(conference.start_date).getFullYear()}</p>
                            <h2 className="text-xl font-black mb-4">{conference.title}</h2>
                            <div className="w-12 h-1 mb-8" style={{ background: TURQUOISE }}></div>
                            <div className="text-center">
                                <span className="text-[40px]">📚</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-3/4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-emerald-500">✔</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Access: Full</span>
                            <span className="text-orange-400 ml-4">🔓</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Open access</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-4 italic">{conference.title}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-3xl">
                            {conference.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-bold text-slate-600 mb-8">
                            <p>• Venue: {conference.venue}</p>
                            <p>• Start Date: {new Date(conference.start_date).toLocaleDateString('ar-YE')}</p>
                            <p>• End Date: {new Date(conference.end_date).toLocaleDateString('ar-YE')}</p>
                            <p>• Contact: {conference.contact_email || 'contact@sabauni.edu.ye'}</p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                to={`/researcher/research/create?confId=${id}`} 
                                onClick={handleRegisterPaper}
                                className="px-8 py-3 font-black rounded-sm transition shadow-lg hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${TURQUOISE}, ${OCEAN})`, color: PRUSSIAN_DARK }}
                            >
                                Submit Manuscript
                            </Link>
                            <button 
                                onClick={handleRegisterAttendance}
                                disabled={isRegistered || regLoading}
                                className={`px-8 py-3 rounded-sm font-black transition ${isRegistered ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-800 border border-gray-200 hover:bg-gray-50 shadow-sm'}`}
                            >
                                {regLoading ? 'Processing...' : isRegistered ? 'Registered as Attendee ✓' : 'Register Attendance'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Articles Section */}
                    <div className="lg:w-3/4">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8 border-b border-gray-100 pb-4">Articles in this Conference</h3>
                        
                        {!conference.papers || conference.papers.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-sm italic text-gray-400">No published articles yet for this conference.</div>
                        ) : (
                        <div className="lg:pl-20 space-y-16">
                            {conference.papers.map((paper) => (
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
                                        <span className="bg-slate-100 px-2 py-0.5 rounded-sm text-slate-600">المجلد {paper.volume || 5} العدد {paper.issue || 1} ({new Date(conference.start_date).getFullYear()})</span>
                                        <span className="text-gray-300">|</span>
                                        {paper.doi && paper.doi.startsWith('10.') ? (
                                            <a href={`https://doi.org/${paper.doi}`} target="_blank" className="text-teal-600 hover:underline">DOI: https://doi.org/{paper.doi}</a>
                                        ) : (
                                            <span className="text-gray-400 italic">DOI: {paper.doi && !paper.doi.includes('Paper ID') ? paper.doi : 'Pending / قيد التخصيص'}</span>
                                        )}
                                    </div>

                                    {/* Abstract Section */}
                                    <div className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-3 italic">
                                        {paper.abstract}
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
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:w-1/4 space-y-12">
                         <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Journal Info</h4>
                            <p className="text-xs text-gray-500 leading-relaxed italic">
                                This conference is part of the SCR network, ensuring peer-reviewed quality and open-access visibility for all researchers.
                            </p>
                        </div>

                        <div className="border-b border-gray-100 pb-8">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-800 w-fit pb-1">Deadlines</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">Submission</span>
                                    <span style={{ color: OCEAN }}>{new Date(conference.submission_deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">Notification</span>
                                    <span>{new Date(conference.notification_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
