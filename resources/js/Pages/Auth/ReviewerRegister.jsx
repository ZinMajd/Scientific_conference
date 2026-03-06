import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ReviewerRegister() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        username: '',
        password: '',
        affiliation: '',
        phone: '',
        address: '',
        bio: '',
        role: 'reviewer',
        expertise: [], // [{topic_id: 1, proficiency: 'expert'}]
    });
    const [cvFile, setCvFile] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('/api/topics');
                setTopics(response.data);
            } catch (err) {
                console.error('Failed to fetch topics', err);
            }
        };
        fetchTopics();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExpertiseChange = (topicId, proficiency) => {
        const exists = formData.expertise.find(e => e.topic_id === topicId);
        let newExpertise;
        if (exists) {
            if (!proficiency) {
                newExpertise = formData.expertise.filter(e => e.topic_id !== topicId);
            } else {
                newExpertise = formData.expertise.map(e => 
                    e.topic_id === topicId ? { ...e, proficiency } : e
                );
            }
        } else if (proficiency) {
            newExpertise = [...formData.expertise, { topic_id: topicId, proficiency }];
        } else {
            newExpertise = formData.expertise;
        }
        setFormData({ ...formData, expertise: newExpertise });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.expertise.length === 0) {
            setError('يرجى اختيار تخصص واحد على الأقل');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('user_type', 'reviewer');
        data.append('affiliation', formData.affiliation);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        data.append('bio', formData.bio);
        if (cvFile) {
            data.append('cv_file', cvFile);
        }
        
        formData.expertise.forEach((exp, index) => {
            data.append(`expertise[${index}][topic_id]`, exp.topic_id);
            data.append(`expertise[${index}][proficiency]`, exp.proficiency);
        });

        try {
            await axios.post('/api/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            navigate('/login', { 
                state: { 
                    message: 'تم تقديم طلب الانضمام كمحكم بنجاح! سنقوم بمراجعة بياناتك والتواصل معك.',
                    username: formData.username
                } 
            });
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors).flat()[0];
                setError(firstError || 'بيانات المدخلات غير صالحة');
            } else {
                setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-blue-950 mb-3 font-['Cairo'] tracking-tight">تسجيل محكم جديد</h1>
                    <p className="text-gray-400 font-medium">قدم خبراتك العلمية للمساهمة في جودة الأبحاث</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 font-bold rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">الاسم الكامل</label>
                            <input 
                                type="text" 
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="الاسم الكامل"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="البريد الإلكتروني"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">اسم المستخدم</label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="اسم المستخدم"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">كلمة المرور</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="كلمة المرور"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">الجهة الأكاديمية</label>
                            <input 
                                type="text" 
                                name="affiliation"
                                value={formData.affiliation}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="مثال: جامعة إقليم سبأ"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">رقم الهاتف</label>
                            <input 
                                type="text" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                                placeholder="رقم الهاتف"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2 block">مجالات التخصص والخبرة</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100">
                            {topics.map(topic => (
                                <div key={topic.id} className="flex flex-col space-y-2 p-3 bg-white rounded-xl shadow-sm">
                                    <span className="font-bold text-gray-700 text-sm">{topic.name}</span>
                                    <select 
                                        className="text-xs p-2 bg-gray-50 border rounded-lg outline-none focus:border-blue-500"
                                        onChange={(e) => handleExpertiseChange(topic.id, e.target.value)}
                                        value={formData.expertise.find(exp => exp.topic_id === topic.id)?.proficiency || ''}
                                    >
                                        <option value="">غير محدد</option>
                                        <option value="beginner">مبتدئ</option>
                                        <option value="intermediate">متوسط</option>
                                        <option value="expert">خبير</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">السيرة الذاتية (PDF/Doc)</label>
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setCvFile(e.target.files[0])}
                            required
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl outline-none transition-all duration-300 font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-blue-950 uppercase tracking-widest mr-2">نبذة عن المجالات العلمية</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all duration-300 font-medium"
                            placeholder="اذكر ملخصاً عن تجاربك في التحكيم العلمي..."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-blue-950 text-white rounded-3xl font-black text-lg shadow-2xl shadow-blue-900/20 hover:bg-blue-900 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'جاري إرسال البيانات...' : 'تقديم طلب الانضمام'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 font-medium">ليس الآن؟ <Link to="/register" className="text-blue-600 font-black hover:underline underline-offset-4">العودة للتسجيل العادي</Link></p>
                </div>
            </div>
        </div>
    );
}
