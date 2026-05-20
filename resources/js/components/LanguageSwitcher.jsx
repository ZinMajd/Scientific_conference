import React, { useState, useEffect } from 'react';

export default function LanguageSwitcher({ theme = 'light' }) {
    // Read initial language from googtrans cookie
    const [currentLang, setCurrentLang] = useState(() => {
        try {
            const match = document.cookie.match(/googtrans=\/ar\/([^;]+)/);
            if (match && match[1]) {
                return match[1];
            }
        } catch (e) {
            console.error('Failed to parse language cookie', e);
        }
        return 'ar';
    });

    const switchLanguage = (langCode) => {
        document.cookie = `googtrans=/ar/${langCode}; path=/; SameSite=Lax`;
        document.cookie = `googtrans=/ar/${langCode}; path=/; domain=${window.location.hostname}; SameSite=Lax`;
        
        setCurrentLang(langCode);
        localStorage.setItem('locale', langCode);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));

        let select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        } else {
            let retries = 0;
            const interval = setInterval(() => {
                select = document.querySelector('.goog-te-combo');
                if (select) {
                    select.value = langCode;
                    select.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    clearInterval(interval);
                }
                retries++;
                if (retries > 30) {
                    clearInterval(interval);
                }
            }, 100);
        }
    };

    const containerClass = theme === 'dark' ? 'bg-black/20' : 'bg-gray-200/50';
    const activeClass = 'bg-teal-500 text-white shadow-md';
    const inactiveClass = theme === 'dark' ? 'text-white/50 hover:text-white/90' : 'text-slate-500 hover:text-slate-800';

    return (
        <div className={`flex items-center rounded-full p-1 notranslate ${containerClass}`}>
            <button 
                onClick={() => switchLanguage('ar')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${currentLang === 'ar' ? activeClass : inactiveClass}`}
            >
                العربية
            </button>
            <button 
                onClick={() => switchLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${currentLang === 'en' ? activeClass : inactiveClass}`}
            >
                English
            </button>
        </div>
    );
}
