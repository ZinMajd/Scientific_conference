import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Show() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
             try {
                const token = localStorage.getItem('token');
                const [confRes, regRes] = await Promise.all([
                    axios.get(`/api/conferences/${id}`),
                    token ? axios.get(`/api/conferences/${id}/check-registration`).catch(() => ({ data: { registered: false } })) : Promise.resolve({ data: { registered: false } })
                ]);
                console.log('Final check - axios baseURL:', axios.defaults.baseURL);
                console.log('Final check - Conference data:', confRes.data);
                console.log('Final check - Venue:', confRes.data.venue);
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
            alert('تم التسجيل كحضور بنجاح!');
        } catch (error) {
            alert(error.response?.data?.message || 'فشل التسجيل');
        } finally {
            setRegLoading(false);
        }
    };
    
    // Helper to handle Register Paper click
    const handleRegisterPaper = (e) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            window.location.href = `/login?redirect=/researcher/research/create?confId=${id}`;
        }
    };

    if (loading) {
        return <div className="text-center py-20">جاري التحميل...</div>;
    }

    if (!conference) {
        return <div className="text-center py-20">المؤتمر غير موجود</div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header Banner */}
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-2xl">
                <div className="absolute inset-0 bg-gray-900">
                     {conference.image_url && <img src={conference.image_url} alt={conference.title} className="w-full h-full object-cover opacity-50" />}
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 right-0 p-8 md:p-12 text-white">
                    <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">مؤتمر علمي</span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{conference.title}</h1>
                    <p className="text-gray-300 max-w-2xl text-lg">
                        {conference.description}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-10">
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            عن المؤتمر
                        </h2>
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            <p>
                                {conference.description}
                            </p>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                            المحاور العلمية
                        </h2>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {['تطبيقات الذكاء الاصطناعي', 'أمن المعلومات', 'البيانات الضخمة', 'الروبوتات الذكية', 'الحوسبة السحابية', 'انترنت الأشياء'].map((track, idx) => (
                                <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">{track}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-6">معلومات التسجيل</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-500">بداية المؤتمر</span>
                                <span className="font-bold">{new Date(conference.start_date).toLocaleDateString('ar-YE')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-500">نهاية المؤتمر</span>
                                <span className="font-bold text-red-600">{new Date(conference.end_date).toLocaleDateString('ar-YE')}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-500">الموقع</span>
                                <span className="font-bold text-green-600">{conference.venue || 'غير محدد'}</span>
                            </div>
                        </div>

                        <Link 
                            to={`/researcher/research/create?confId=${id}`} 
                            onClick={handleRegisterPaper}
                            className="block w-full text-center py-4 bg-blue-950 hover:bg-blue-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 mb-3"
                        >
                            تسجيل ورقة بحثية
                        </Link>
                        <button 
                            onClick={handleRegisterAttendance}
                            disabled={isRegistered || regLoading}
                            className={`w-full py-4 rounded-xl font-bold transition ${isRegistered ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                        >
                            {regLoading ? 'جاري المعالجة...' : isRegistered ? 'تم التسجيل كحضور ✅' : 'تسجيل كحضور'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
