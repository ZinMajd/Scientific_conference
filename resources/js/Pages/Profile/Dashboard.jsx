import React from 'react';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar Menu */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-md">
                            <img src={`https://ui-avatars.com/api/?name=${user?.full_name || user?.name || 'User'}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{user?.full_name || user?.name || 'مستخدم'}</h3>
                        <p className="text-gray-500 text-sm">باحث</p>
                    </div>
                    
                    <nav className="space-y-2">
                        {['الملف الشخصي', 'أبحاثي', 'المؤتمرات المسجلة', 'شهادات الحضور', 'الإشعارات', 'تسجيل الخروج'].map((item, idx) => (
                            <button key={idx} className={`w-full text-right px-4 py-3 rounded-lg transition font-medium ${idx === 0 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}>
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-gray-500 mb-2">الأبحاث المقدمة</h4>
                            <p className="text-3xl font-bold text-gray-800">3</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-gray-500 mb-2">المؤتمرات القادمة</h4>
                            <p className="text-3xl font-bold text-blue-600">1</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="text-gray-500 mb-2">الشهادات</h4>
                            <p className="text-3xl font-bold text-green-600">5</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-800">سجل الأنشطة الحديثة</h3>
                        </div>
                        <div>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        📝
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">تم قبول الملخص البحثي</h4>
                                        <p className="text-sm text-gray-500">تم قبول ملخص بحثك للمؤتمر الدولي للذكاء الاصطناعي</p>
                                        <span className="text-xs text-gray-400 mt-1 block">منذ ساعتين</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
