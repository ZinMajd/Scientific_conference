import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import IdleWarningModal from '../components/IdleWarningModal';
import useIdleTimer from '../hooks/useIdleTimer';

export default function ProfileLayout() {
    const navigate = useNavigate();
    const [showIdleWarning, setShowIdleWarning] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { message: 'تم تسجيل خروجك تلقائياً بسبب عدم النشاط.' } });
    }, [navigate]);

    const handleWarn = useCallback(() => {
        setShowIdleWarning(true);
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const { resetTimer } = useIdleTimer(handleWarn, handleLogout);

    const handleContinue = useCallback(() => {
        setShowIdleWarning(false);
        setCountdown(60);
        resetTimer();
    }, [resetTimer]);

    // We wrap ProfileLayout inside MainLayout to keep the header/footer
    // but we can add specific profile styling here if needed
    return (
        <>
        <IdleWarningModal
            visible={showIdleWarning}
            secondsLeft={countdown}
            onContinue={handleContinue}
            onLogout={handleLogout}
        />
        <div className="min-h-screen" style={{ background: '#f0fafa' }} dir="rtl">
            <main className="container mx-auto py-10 px-4">
                <Outlet />
            </main>
        </div>
        </>
    );
}
