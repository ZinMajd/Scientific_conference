import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#40E0D0';
const OCEAN = '#0096c7';

export default function ReviewerRegister() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '', email: '', username: '', password: '',
        affiliation: '', phone: '', address: '', bio: '',
        role: 'reviewer', expertise: [],
    });
    const [cvFile, setCvFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/topics')
            .then(res => setTopics(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleExpertiseChange = (topicId, proficiency) => {
        const exists = formData.expertise.find(e => e.topic_id === topicId);
        let newExpertise;
        if (exists) {
            newExpertise = !proficiency 
                ? formData.expertise.filter(e => e.topic_id !== topicId)
                : formData.expertise.map(e => e.topic_id === topicId ? { ...e, proficiency } : e);
        } else if (proficiency) {
            newExpertise = [...formData.expertise, { topic_id: topicId, proficiency }];
        } else {
            newExpertise = formData.expertise;
        }
        setFormData({ ...formData, expertise: newExpertise });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.expertise.length === 0) return setError('يرجى اختيار تخصص واحد على الأقل');
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'expertise') data.append(key, formData[key]);
        });
        if (cvFile) data.append('cv_file', cvFile);
        formData.expertise.forEach((exp, i) => {
            data.append(`expertise[${i}][topic_id]`, exp.topic_id);
            data.append(`expertise[${i}][proficiency]`, exp.proficiency);
        });

        try {
            await axios.post('/api/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/login', { state: { message: 'تم تقديم طلب الانضمام كمحكم بنجاح! سنقوم بمراجعة بياناتك.', username: formData.username } });
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK}08 0%, ${TURQUOISE}10 100%)` }}>
            
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                style={{ border: `1px solid ${TURQUOISE}30` }}>
                
                <div className="p-10 text-center text-white"
                    style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 60%, ${OCEAN} 100%)` }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                        style={{ background: `${TURQUOISE}25`, border: `2px solid ${TURQUOISE}50` }}>
                        👨‍🏫
                    </div>
                    <h1 className="text-3xl font-black mb-2">تسجيل محكم جديد</h1>
                    <p className="text-white/70 text-sm">قدم خبراتك العلمية للمساهمة في جودة الأبحاث</p>
                </div>

                <div className="p-10">
                    {error && <div className="mb-6 p-4 rounded-xl text-sm font-bold bg-red-50" style={{ borderRight: '4px solid #ef4444', color: '#b91c1c' }}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest" style={{ color: PRUSSIAN }}>الاسم الكامل</label>
                                <input type="text" name="full_name" onChange={handleChange} required className="w-full px-5 py-3 bg-gray-50 border rounded-xl outline-none transition focus:bg-white" style={{ borderColor: `${PRUSSIAN}15` }} placeholder="الاسم الكامل" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest" style={{ color: PRUSSIAN }}>البريد الإلكتروني</label>
                                <input type="email" name="email" onChange={handleChange} required className="w-full px-5 py-3 bg-gray-50 border rounded-xl outline-none transition focus:bg-white" style={{ borderColor: `${PRUSSIAN}15` }} placeholder="mail@example.com" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest block" style={{ color: PRUSSIAN }}>مجالات التخصص والخبرة</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 bg-gray-50 rounded-2xl border" style={{ borderColor: `${PRUSSIAN}10` }}>
                                {topics.map(t => (
                                    <div key={t.id} className="flex flex-col p-3 bg-white rounded-xl shadow-sm border" style={{ borderColor: `${TURQUOISE}20` }}>
                                        <span className="font-bold text-xs mb-2">{t.name}</span>
                                        <select className="text-[10px] p-1.5 border rounded-lg outline-none" onChange={(e) => handleExpertiseChange(t.id, e.target.value)}>
                                            <option value="">غير محدد</option>
                                            <option value="beginner">مبتدئ</option>
                                            <option value="intermediate">متوسط</option>
                                            <option value="expert">خبير</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest" style={{ color: PRUSSIAN }}>السيرة الذاتية (PDF)</label>
                            <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files[0])} required className="w-full px-5 py-3 bg-gray-50 border-2 border-dashed rounded-xl outline-none" style={{ borderColor: `${TURQUOISE}40` }} />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition hover:opacity-90 mt-4" style={{ background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` }}>
                            {loading ? 'جاري الإرسال...' : 'تقديم طلب الانضمام'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
