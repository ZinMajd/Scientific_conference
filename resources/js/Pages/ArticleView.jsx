import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const translations = {
    ar: {
        uniName: "جامعة إقليم سبأ",
        systemName: "نظام إدارة المؤتمرات العلمية",
        home: "الرئيسية",
        archives: "الأرشيف",
        about: "حول",
        vol: "المجلد",
        issue: "العدد",
        articles: "المقالات",
        received: "تاريخ الاستلام:",
        accepted: "تاريخ القبول:",
        publishedOnline: "تاريخ النشر الإلكتروني:",
        keywords: "الكلمات المفتاحية:",
        references: "المراجع",
        downloads: "التحميلات",
        viewPdf: "عرض PDF",
        downloadBtn: "تحميل",
        doi: "معرف الكائن الرقمي (DOI)",
        published: "تاريخ النشر",
        notFound: "لم يتم العثور على المقال",
        backToArchive: "العودة للأرشيف",
        copyright: "حقوق النشر ©",
        rights: "جامعة إقليم سبأ. جميع الحقوق محفوظة."
    },
    en: {
        uniName: "University of Saba Region",
        systemName: "Scientific Conference Management System",
        home: "Home",
        archives: "Archives",
        about: "About",
        vol: "Vol",
        issue: "Issue",
        articles: "Articles",
        received: "Received:",
        accepted: "Accepted:",
        publishedOnline: "Published Online:",
        keywords: "Keywords:",
        references: "References",
        downloads: "Downloads",
        viewPdf: "View PDF",
        downloadBtn: "Download",
        doi: "DOI",
        published: "Published",
        notFound: "Article Not Found",
        backToArchive: "Back to Archive",
        copyright: "Copyright ©",
        rights: "University of Saba Region. All rights reserved."
    }
};

export default function ArticleView() {
    const { id } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState(localStorage.getItem('locale') || 'ar');

    const t = translations[lang];

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('locale', newLang);
    };

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                const response = await axios.get(`/api/article/${id}`);
                setPaper(response.data);
            } catch (error) {
                console.error('Error fetching paper:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaper();
    }, [id]);

    const handleDownload = async () => {
        try {
            await axios.post(`/api/article/${id}/download-stat`);
            window.open(`/storage_file/${paper.final_file_path || paper.file_path}`, '_blank');
        } catch (error) {
            console.error('Error recording download:', error);
            window.open(`/storage_file/${paper.final_file_path || paper.file_path}`, '_blank');
        }
    };

    const handleForceDownload = async () => {
        try {
            await axios.post(`/api/article/${id}/download-stat`);
        } catch (error) {
            console.error('Error recording download:', error);
        } finally {
            const link = document.createElement('a');
            link.href = `/storage_file/${paper.final_file_path || paper.file_path}`;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#005c99]"></div>
        </div>
    );

    if (!paper) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{t.notFound}</h1>
                <Link to="/archive" className="text-[#005c99] hover:underline">{t.backToArchive}</Link>
            </div>
        </div>
    );

    const publishDate = new Date(paper.publish_at || paper.updated_at || Date.now());
    const receiveDate = new Date(paper.created_at || Date.now());
    const acceptDate = new Date(paper.updated_at || Date.now());

    return (
        <div className={`min-h-screen bg-[#f8f9fa] pb-20 ${lang === 'ar' ? "font-['Cairo']" : "font-sans"} text-[#333333]`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            {/* Conference Tabs Bar - same as Show.jsx */}
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

            {/* Main Content Container */}
            <div className="max-w-[1400px] mx-auto px-0 mt-8 bg-white pt-8 pb-10 shadow-sm border border-gray-200 rounded-sm">
                
                {/* Breadcrumbs */}
                <nav className="text-[13px] text-gray-500 mb-8 font-medium px-8" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex flex-wrap items-center">
                        <li className="flex items-center">
                            <Link to="/" className="text-[#005c99] hover:underline">{t.home}</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center">
                            <Link to="/archive" className="text-[#005c99] hover:underline">{t.archives}</Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center">
                            <Link to="/archive" className="text-[#005c99] hover:underline">
                                {t.vol} {paper.volume || 1} {t.issue} {paper.issue || 1} ({publishDate.getFullYear()})
                            </Link>
                            <span className="mx-2">/</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            {t.articles}
                        </li>
                    </ol>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="lg:w-[70%] px-8">
                        <h1 className="text-[28px] font-bold text-[#222222] mb-6 leading-[1.3]" dir="auto">
                            {paper.title}
                        </h1>

                        {/* Authors */}
                        <div className="mb-6">
                            <ul className="list-none p-0 m-0" dir="auto">
                                <li className="mb-4">
                                    <div className="text-[17px] font-semibold text-[#005c99] flex items-center gap-2">
                                        {paper.author?.full_name}
                                        <sup className="text-gray-500 text-[11px] font-normal">1</sup>
                                        <a href={`mailto:${paper.author?.email || 'author@example.com'}`} className="text-gray-400 hover:text-[#005c99]">
                                            <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        </a>
                                    </div>
                                    <div className="text-[13px] text-[#555555] mt-1 flex items-start gap-1">
                                        <sup className="mt-0.5">1</sup> <span>{paper.author?.affiliation || (lang === 'ar' ? 'جامعة إقليم سبأ، اليمن' : 'University of Saba Region, Yemen')}</span>
                                    </div>
                                </li>
                                {paper.coauthors && paper.coauthors.map((co, idx) => (
                                    <li key={idx} className="mb-4">
                                        <div className="text-[17px] font-semibold text-[#005c99] flex items-center gap-2">
                                            {co.full_name || co}
                                            <sup className="text-gray-500 text-[11px] font-normal">{idx + 2}</sup>
                                        </div>
                                        <div className="text-[13px] text-[#555555] mt-1 flex items-start gap-1">
                                            <sup className="mt-0.5">{idx + 2}</sup> <span>{co.affiliation || (lang === 'ar' ? 'جامعة إقليم سبأ، اليمن' : 'University of Saba Region, Yemen')}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dates row */}
                        <div className="text-[13.5px] text-[#003153] font-bold border-y border-gray-200 py-3 mb-6 flex flex-wrap gap-x-6 gap-y-2">
                            <span>{t.received} <span dir="ltr" className="inline-block font-bold">{receiveDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span></span>
                            <span className="hidden sm:inline text-gray-300">|</span>
                            <span>{t.accepted} <span dir="ltr" className="inline-block font-bold">{acceptDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span></span>
                            <span className="hidden sm:inline text-gray-300">|</span>
                            <span>{t.publishedOnline} <span dir="ltr" className="inline-block font-bold">{publishDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span></span>
                        </div>

                        {/* Content Wrapper for spacing from edge */}
                        <div className="rtl:mr-8 ltr:ml-8">
                            {/* Abstract */}
                            <div className="mb-6">
                                <br />
                                <br />
                                <h3 className="text-[17px] font-bold text-[#003153] mb-4">
                                    {lang === 'ar' ? 'الملخص' : 'Abstract'}
                                </h3>
                                <div className="text-[15.5px] text-[#444444] leading-[1.8] text-justify whitespace-pre-line" dir="auto">
                                    {paper.abstract}
                                </div>
                            </div>

                            {/* Keywords */}
                            {paper.keywords && (
                                <div className="mb-6" dir="auto">
                                    <br />
                                    <br />
                                    <h3 className="text-[16px] font-bold text-[#222222] mb-2">{t.keywords}</h3>
                                    <p className="text-[15px] text-[#555555] italic">
                                        {paper.keywords}
                                    </p>
                                </div>
                            )}

                            {/* References */}
                            <div className="mb-8">
                                <br />
                                <br />
                                <h2 className="text-[18px] font-bold text-[#222222] mb-4 border-b border-gray-200 pb-2">{t.references}</h2>
                                <div className="text-[14px] text-[#555555] space-y-3 leading-relaxed" dir="auto">
                                    {paper.references ? (
                                        <div className="whitespace-pre-line">{paper.references}</div>
                                    ) : (
                                        <ol className="list-decimal pl-5 rtl:pr-5 rtl:pl-0 space-y-2">
                                            <li>Al-Wajeeh, M. S., et al. (2026). "Cognitive Password Systematic Review: Limitations, Challenges, and Solutions." University of Saba Region Scientific Conference Records.</li>
                                            <li>Smith, J., & Doe, A. (2025). "Advanced Authentication Mechanisms." International Journal of Cybersecurity, 12(3), 45-67.</li>
                                            <li>IEEE Standard for Biometric Authentication (2024). IEEE Std 1452-2024.</li>
                                        </ol>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px bg-gray-200 self-stretch mx-1"></div>

                    {/* Sidebar Area */}
                    <div className="lg:w-[30%] space-y-8 px-4 pt-2">
                        {/* Article Thumbnail */}
                        {paper.thumbnail_path && (
                            <div className="mb-6">
                                <img 
                                    src={`/storage_file/${paper.thumbnail_path}`} 
                                    alt={paper.title} 
                                    className="w-full h-auto object-cover rounded-sm shadow-sm border border-gray-200"
                                />
                            </div>
                        )}

                        {/* Downloads */}
                        <div>
                            <h3 className="text-[16px] font-bold text-[#222222] mb-4 border-b border-gray-200 pb-2">{t.downloads}</h3>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleDownload}
                                    className="flex-1 bg-[#005c99] hover:bg-[#004a7a] text-white py-[10px] px-2 rounded-sm transition flex items-center justify-center gap-2 font-medium shadow-sm text-[14px]"
                                >
                                    {t.viewPdf}
                                </button>
                                <button 
                                    onClick={handleForceDownload}
                                    className="flex-1 bg-white border border-[#005c99] text-[#005c99] hover:bg-gray-50 py-[10px] px-2 rounded-sm transition flex items-center justify-center gap-2 font-medium shadow-sm text-[14px]"
                                >
                                    {t.downloadBtn}
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <div className="mb-6">
                                <h3 className="text-[14px] font-bold text-[#555555] mb-1">{t.doi}</h3>
                                <a 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-[14px] text-[#005c99] hover:underline break-all block mb-1 cursor-pointer"
                                >
                                    https://doi.org/10.54963/jic.v5i1.{paper.id}
                                </a>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-[14px] font-bold text-[#555555] mb-1">{t.published}</h3>
                                <p className="text-[14px] text-[#333333]">
                                    {publishDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-12 bg-white py-8 border-t border-gray-200">
                <div className="max-w-[1200px] mx-auto px-4 text-center text-[13px] text-[#777777]">
                    <p>{t.copyright} {new Date().getFullYear()} {t.rights}</p>
                </div>
            </div>
        </div>
    );
}
