import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function EditorialTeam({ type = 'editorial' }) {
    const [team, setTeam] = useState({
        editors_in_chief: [],
        editors: [],
        office: [],
        production: [],
        reviewers: [],
        advisory: []
    });
    const [loading, setLoading] = useState(true);
    const [lang] = useState(localStorage.getItem('locale') || 'ar');

    useEffect(() => {
        axios.get('/api/journal/editorial-team')
            .then(res => setTeam(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const MemberRow = ({ member, showInterests = true }) => (
        <div className="flex flex-row items-start gap-5 md:gap-6 mb-14">
            {/* Photo Box */}
            <div className="flex-shrink-0">
                {member.profile_image ? (
                    <img 
                        src={`/storage_file/${member.profile_image}`} 
                        alt={member.full_name} 
                        className="w-28 h-[135px] object-cover border border-gray-200 rounded-none shadow-none"
                    />
                ) : (
                    <div className="w-28 h-[135px] bg-[#f4f5f7] border border-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                )}
            </div>
            
            {/* Info Box */}
            <div className="flex flex-col space-y-0.5 text-right flex-1">
                <span className="text-base font-bold text-[#2c599c] hover:underline cursor-pointer">
                    {member.full_name}
                </span>
                <p className="text-sm text-gray-600 leading-normal">
                    {member.affiliation || (lang === 'ar' ? 'جامعة إقليم سبأ، اليمن' : 'University of Saba Region, Yemen')}
                </p>
                {showInterests && member.bio && (
                    <p className="text-sm text-gray-600 leading-normal">
                        <span className="font-semibold text-gray-700">
                            {lang === 'ar' ? 'مجالات البحث: ' : 'Research Interests: '}
                        </span> 
                        {member.bio}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen bg-[#f8f9fa] pb-20 ${lang === 'ar' ? "font-['Cairo']" : "font-sans"} text-[#333333]`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            {/* Conference Tabs Bar */}
            <div className="w-full border-b border-gray-100 bg-white flex justify-center" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                <div className="w-[95%] max-w-7xl flex flex-wrap flex-row gap-12 text-[17px] font-black items-center justify-start text-black">
                    <Link to="/topical-collection" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">
                        {lang === 'ar' ? 'مجموعة المواضيع' : 'Topical Collection'}
                    </Link>
                    <Link to="/submissions" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">
                        {lang === 'ar' ? 'إرشادات التقديم' : 'Submission Guidelines'}
                    </Link>
                    <Link to="/about" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">
                        {lang === 'ar' ? 'عن' : 'About'}
                    </Link>
                    <Link to="/archive" className="hover:text-red-700 transition px-4 py-2 border-b-2 border-transparent hover:border-red-700 whitespace-nowrap">
                        {lang === 'ar' ? 'أرشيف' : 'Archive'}
                    </Link>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 py-3">
                <div className="w-[95%] max-w-5xl mx-auto flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                    <Link to="/" className="text-[#005c99] hover:underline">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                    <span>/</span>
                    <Link to="/archive" className="text-[#005c99] hover:underline">{lang === 'ar' ? 'جامعة إقليم سبأ' : 'University of Saba Region'}</Link>
                    <span>/</span>
                    <span className="text-gray-700 font-semibold">
                        {type === 'advisory' 
                            ? (lang === 'ar' ? 'المستشارون' : 'Advisory Board') 
                            : (lang === 'ar' ? 'هيئة التحرير' : 'Editorial Board')}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-[95%] max-w-5xl mx-auto mt-12 bg-transparent px-6 sm:px-16 md:px-24 py-4">

                {/* Page Title */}
                <h1 className="text-[28px] font-bold text-[#222222] mb-10 pb-4 border-b border-gray-200">
                    {type === 'advisory' 
                        ? (lang === 'ar' ? 'المستشارون' : 'Advisory Board') 
                        : (lang === 'ar' ? 'هيئة التحرير' : 'Editorial Team')}
                </h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#005c99]"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {type === 'editorial' && (
                            <>
                                {/* Editor-in-Chief Section */}
                                {team.editors_in_chief.length > 0 && (
                                    <section>
                                        <h2 className="text-[18px] font-bold text-[#222222] mb-6">
                                            {lang === 'ar' ? 'رئيس التحرير' : 'Editor-in-Chief'}
                                        </h2>
                                        <div>
                                            {team.editors_in_chief.map((editor, idx) => (
                                                <MemberRow key={idx} member={editor} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Editors Section */}
                                {team.editors.length > 0 && (
                                    <section>
                                        <h2 className="text-[18px] font-bold text-[#222222] mb-6">
                                            {lang === 'ar' ? 'أعضاء هيئة التحرير' : 'Editors'}
                                        </h2>
                                        <div>
                                            {team.editors.map((editor, idx) => (
                                                <MemberRow key={idx} member={editor} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Editorial Office (Merged visually with previous section) */}
                                {team.office.length > 0 && (
                                    <div>
                                        {team.office.map((member, idx) => (
                                            <MemberRow key={idx} member={member} showInterests={false} />
                                        ))}
                                    </div>
                                )}

                                {/* Reviewers */}
                                {team.reviewers.length > 0 && (
                                    <section>
                                        <h2 className="text-[18px] font-bold text-[#222222] mb-6">
                                            {lang === 'ar' ? 'المحكمون' : 'Reviewers'}
                                        </h2>
                                        <div>
                                            {team.reviewers.map((member, idx) => (
                                                <MemberRow key={idx} member={member} showInterests={false} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Production Office */}
                                {team.production.length > 0 && (
                                    <section>
                                        <h2 className="text-[18px] font-bold text-[#222222] mb-6">
                                            {lang === 'ar' ? 'مكتب الإنتاج' : 'Production Office'}
                                        </h2>
                                        <div>
                                            {team.production.map((member, idx) => (
                                                <MemberRow key={idx} member={member} showInterests={false} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}

                        {type === 'advisory' && (
                            <>
                                {/* Advisory / Scientific Committee Section */}
                                {team.advisory.length > 0 && (
                                    <section>
                                        <h2 className="text-[18px] font-bold text-[#222222] mb-6">
                                            {lang === 'ar' ? 'المستشارون / اللجنة العلمية' : 'Advisory Board / Scientific Committee'}
                                        </h2>
                                        <div>
                                            {team.advisory.map((member, idx) => (
                                                <MemberRow key={idx} member={member} showInterests={true} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}

                        {/* Fallback if no data */}
                        {((type === 'editorial' && team.editors_in_chief.length === 0 && team.editors.length === 0 && team.office.length === 0 && team.production.length === 0 && team.reviewers.length === 0) || 
                          (type === 'advisory' && team.advisory.length === 0)) && (
                            <div className="text-center py-16 text-gray-400 text-[15px]">
                                {lang === 'ar' ? 'لا توجد بيانات لعرضها حالياً.' : 'No team members to display at this time.'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 bg-white py-8 border-t border-gray-200">
                <div className="max-w-5xl mx-auto px-4 text-center text-[13px] text-[#777777]">
                    <p>
                        {lang === 'ar'
                            ? `حقوق النشر © ${new Date().getFullYear()} جامعة إقليم سبأ. جميع الحقوق محفوظة.`
                            : `Copyright © ${new Date().getFullYear()} University of Saba Region. All rights reserved.`}
                    </p>
                </div>
            </div>
        </div>
    );
}
