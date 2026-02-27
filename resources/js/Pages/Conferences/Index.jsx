import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Conferences() {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get('/api/conferences');
                setConferences(response.data);
            } catch (err) {
                console.error('Error fetching conferences:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConferences();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">المؤتمرات المتاحة</h1>
            <div className="grid gap-6">
                {conferences.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 h-44 bg-blue-900 rounded-2xl shrink-0 overflow-hidden">
                             {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                        </div>
                        <div className="grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-blue-950 hover:text-blue-600 transition-colors uppercase">{item.title}</h2>
                                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                                        <span>#مؤتمر_علمي</span>
                                        <span>•</span>
                                        <span className={item.status === 'open' || item.status === 'reviewing' ? 'text-green-600' : 'text-red-600'}>
                                            {item.status === 'open' || item.status === 'reviewing' ? 'متاح للتسجيل' : 'منتهي'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2 italic pr-4 border-r-2 border-gray-100">
                                {item.description}
                            </p>
                            <div className="flex gap-6 text-sm text-gray-600 border-t pt-4 mt-2">
                                <span>📅 التاريخ: {item.start_date}</span>
                                <span>📍 المكان: {item.location}</span>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Link to={`/conferences/${item.id}`} className="px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition font-bold shadow-md">
                                    عرض التفاصيل
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
