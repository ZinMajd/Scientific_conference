import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommitteeSessions() {
    const [sessions, setSessions] = useState([]);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '', conf_id: '', room: '', start_time: '', end_time: '', session_type: 'oral'
    });
    const [conferences, setConferences] = useState([]);

    useEffect(() => {
        fetchData();
        fetchConferences();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, papersRes] = await Promise.all([
                axios.get('/api/committee/sessions'),
                axios.get('/api/committee/papers?status=accepted')
            ]);
            setSessions(sessionsRes.data);
            setPapers(papersRes.data.data || []);
        } catch (error) {
            console.error("Error fetching sessions/papers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConferences = async () => {
        try {
            const res = await axios.get('/api/conferences');
            setConferences(res.data);
        } catch (error) {
            console.error("Error fetching conferences:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`/api/committee/sessions/${formData.id}`, formData);
                alert('تم تحديث الجلسة بنجاح');
            } else {
                await axios.post('/api/committee/sessions', formData);
                alert('تم إنشاء الجلسة بنجاح');
            }
            setShowModal(false);
            setFormData({ title: '', conf_id: '', room: '', start_time: '', end_time: '', session_type: 'oral' });
            fetchData();
        } catch (error) {
            alert('فشل حفظ الجلسة');
        }
    };

    const addToSession = async (paperId, sessionId) => {
        try {
            await axios.post(`/api/committee/papers/${paperId}/classify-schedule`, {
                session_id: sessionId,
                presentation_type: 'oral', // Default
                participation_mode: 'physical', // Default
            });
            fetchData();
        } catch (error) {
            alert('فشل إضافة البحث إلى الجلسة');
        }
    };

    const removeFromSession = async (paperId) => {
        if (!confirm('هل أنت متأكد من إزالة هذا البحث من الجلسة؟')) return;
        try {
            // Re-classify to 'none' session
            await axios.post(`/api/committee/papers/${paperId}/classify-schedule`, {
                session_id: null,
                presentation_type: 'none',
                participation_mode: 'none',
            });
            fetchData();
        } catch (error) {
            alert('فشل إزالة البحث');
        }
    };

    const editSession = (session) => {
        setFormData({
            id: session.id,
            title: session.title,
            conf_id: session.conf_id,
            room: session.room,
            start_time: session.start_time.replace(' ', 'T').substring(0, 16),
            end_time: session.end_time.replace(' ', 'T').substring(0, 16),
            session_type: session.session_type
        });
        setShowModal(true);
    };

    const deleteSession = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذه الجلسة؟')) return;
        try {
            await axios.delete(`/api/committee/sessions/${id}`);
            fetchData();
        } catch (error) {
            alert('فشل حذف الجلسة');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-emerald-950 font-['Cairo']">جدولة الجلسات العلمية</h1>
                    <p className="text-gray-500 font-medium">تنظيم مواضيع وأوقات الجلسات وتوزيع الأبحاث المقبولة</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >➕ إضافة جلسة جديدة</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-gray-400">جاري التحميل...</div>
                    ) : sessions.length === 0 ? (
                        <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-100 italic text-gray-400">لا توجد جلسات مجدولة حتى الآن.</div>
                    ) : (
                        sessions.map(session => (
                            <div key={session.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <h3 className="text-xl font-black text-emerald-950">{session.title}</h3>
                                            <p className="text-sm font-bold text-gray-400 mt-1">📍 {session.room} | ⏰ {new Date(session.start_time).toLocaleString('ar-YE')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editSession(session)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-emerald-600 transition">✏️</button>
                                        <button onClick={() => deleteSession(session.id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-red-600 transition">🗑️</button>
                                        <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black rounded-xl uppercase tracking-widest">{session.session_type}</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">الأبحاث المشاركة ({session.papers?.length || 0})</h4>
                                    {session.papers?.length > 0 ? (
                                        session.papers.map(paper => (
                                            <div key={paper.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group border border-transparent hover:border-emerald-200 transition">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">📄</div>
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{paper.title}</h5>
                                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{paper.author?.full_name}</p>
                                                </div>
                                                <button onClick={() => removeFromSession(paper.id)} className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition" title="إزالة من الجلسة">❌</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs italic text-gray-400 p-4">لم يتم إضافة أبحاث لهذه الجلسة بعد.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-8">
                    <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/40">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <span className="text-xl">📋</span> الأبحاث المقبولة غير المجدولة
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {papers.length === 0 ? (
                                <p className="text-sm text-emerald-300/60 italic">لا توجد أبحاث بانتظار الجدولة.</p>
                            ) : (
                                papers.map(paper => (
                                    <div key={paper.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                                        <h5 className="text-sm font-bold text-white line-clamp-2">{paper.title}</h5>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-[10px] text-emerald-300/60 font-black">{paper.author?.full_name}</span>
                                            <div className="relative group/menu">
                                                <button className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition">إضافة إلى جلسة</button>
                                                <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover/menu:block z-20">
                                                    {sessions.map(s => (
                                                        <button 
                                                            key={s.id}
                                                            onClick={() => addToSession(paper.id, s.id)}
                                                            className="w-full text-right px-4 py-2 text-[10px] font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition border-b border-gray-50 last:border-0"
                                                        >
                                                            {s.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-black text-emerald-950 mb-6">➕ إضافة جلسة علمية جديدة</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">عنوان الجلسة</label>
                                <input 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المؤتمر</label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                    value={formData.conf_id}
                                    onChange={e => setFormData({...formData, conf_id: e.target.value})}
                                    required
                                >
                                    <option value="">اختر المؤتمر...</option>
                                    {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">القاعة</label>
                                    <input 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={formData.room}
                                        onChange={e => setFormData({...formData, room: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">النوع</label>
                                    <select 
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={formData.session_type}
                                        onChange={e => setFormData({...formData, session_type: e.target.value})}
                                    >
                                        <option value="oral">شفوي (Oral)</option>
                                        <option value="poster">ملصق (Poster)</option>
                                        <option value="keynote">كلمة رئيسية (Keynote)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">وقت البدء</label>
                                    <input 
                                        type="datetime-local"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={formData.start_time}
                                        onChange={e => setFormData({...formData, start_time: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">وقت النهاية</label>
                                    <input 
                                        type="datetime-local"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none"
                                        value={formData.end_time}
                                        onChange={e => setFormData({...formData, end_time: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">حفظ الجلسة</button>
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
