import React, { useState } from 'react';
import axios from 'axios';

const PRUSSIAN = '#003153';
const PRUSSIAN_DARK = '#001a2e';
const TURQUOISE = '#2dd4bf';
const OCEAN = '#0096c7';

export default function Support() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            const response = await axios.post('/api/support', formData);
            setStatus('success');
            setResponseMessage(response.data.message);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
            setResponseMessage(err.response?.data?.message || 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 font-['Cairo'] pb-20 overflow-hidden relative" dir="rtl">
            {/* Hero Header */}
            <section className="relative pt-32 pb-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${PRUSSIAN_DARK} 0%, ${PRUSSIAN} 100%)` }}>
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[100px]" style={{ background: TURQUOISE }}></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[100px]" style={{ background: OCEAN }}></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(255,255,255,0.1)', color: TURQUOISE, border: `1px solid ${TURQUOISE}30` }}>
                        مركز المساعدة والدعم
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                        كيف يمكننا <span style={{ color: TURQUOISE }}>مساعدتك اليوم؟</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-white/70 text-lg font-medium leading-relaxed">
                        نحن هنا للإجابة على استفساراتك وحل المشكلات الفنية المتعلقة بتقديم الأبحاث ومشاركتك في المؤتمرات.
                    </p>
                </div>
                
                {/* Wave effect */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gray-50" style={{ clipPath: 'polygon(0 50%, 100% 100%, 0 100%)' }}></div>
            </section>

            {/* Contact Info Grid (Simplified) */}
            <section className="container mx-auto px-6 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">
                    {[
                        { title: 'البريد الإلكتروني', info: 'support@sabauni.edu.ye', sub: 'نرد خلال 24 ساعة' },
                        { title: 'واتساب الدعم', info: '+967 770 000 000', sub: 'متاح من 8ص - 8م' },
                        { title: 'المقر الرئيسي', info: 'مأرب - جامعة إقليم سبأ', sub: 'كلية الحاسوب ونظم المعلومات' },
                    ].map((item, i) => (
                        <div key={i} className="py-4">
                            <h3 className="text-xl font-black text-white md:text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-teal-400 md:text-indigo-600 font-bold mb-2 ltr text-lg">{item.info}</p>
                            <div className="text-white/60 md:text-gray-400 text-sm font-bold">
                                {item.sub}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form & Info Section */}
            <section className="container mx-auto px-6 mt-80">



                <div className="bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 rounded-none">

                    {/* Form Side */}
                    <div className="flex-1 p-10 md:p-16">
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-gray-900 mb-4">أرسل لنا رسالة</h2>
                            <p className="text-gray-500 font-bold">لديك استفسار خاص؟ املأ النموذج وسنتواصل معك في أقرب وقت.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-1">الاسم الكامل</label>
                                    <input 
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-none outline-none focus:bg-white focus:border-teal-400 transition-all font-bold"
                                        placeholder="اسمك هنا"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-1">البريد الإلكتروني</label>
                                    <input 
                                        type="email" required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-none outline-none focus:bg-white focus:border-teal-400 transition-all font-bold"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-1">الموضوع</label>
                                <input 
                                    type="text" required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-none outline-none focus:bg-white focus:border-teal-400 transition-all font-bold"
                                    placeholder="ما هو استفسارك؟"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-1">الرسالة</label>
                                <textarea 
                                    rows="5" required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-none outline-none focus:bg-white focus:border-teal-400 transition-all font-bold resize-none"
                                    placeholder="اكتب تفاصيل استفسارك هنا..."
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full py-5 rounded-none text-white font-black text-xl shadow-xl transition-all active:scale-[0.98] ${status === 'error' ? 'bg-red-600' : 'disabled:opacity-50'}`}
                                style={status !== 'error' ? { background: `linear-gradient(135deg, ${PRUSSIAN}, ${OCEAN})` } : {}}
                            >
                                {status === 'loading' ? 'جاري الإرسال...' : status === 'success' ? '✓ ' + responseMessage : status === 'error' ? responseMessage : 'إرسال الرسالة الآن ←'}
                            </button>

                        </form>
                    </div>

                    {/* Info Side */}
                    <div className="w-full lg:w-[400px] p-16 text-white relative flex flex-col justify-between" style={{ background: PRUSSIAN_DARK }}>
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <img src="/images/hero_conference.png" className="w-full h-full object-cover grayscale" alt="Background" />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-8">معلومات التواصل</h3>
                            <div className="space-y-10">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-black text-lg mb-1">جامعة إقليم سبأ</h4>
                                    <p className="text-white/60 font-medium text-sm">كلية الحاسوب ونظم المعلومات</p>
                                    <p className="text-white/60 font-medium text-sm">مركز المؤتمرات والبحث العلمي</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-black text-lg mb-1 text-teal-400">ساعات العمل</h4>
                                    <p className="text-white/60 font-medium text-sm">الأحد - الخميس</p>
                                    <p className="text-white/60 font-medium text-sm">8:00 صباحاً - 2:00 ظهراً</p>
                                </div>

                            </div>
                        </div>

                        <div className="relative z-10 pt-20">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <p className="text-sm font-medium leading-relaxed italic text-white/80">
                                    "نسعى لتوفير أفضل تجربة بحثية لك، لا تتردد في طلب المساعدة في أي وقت."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
