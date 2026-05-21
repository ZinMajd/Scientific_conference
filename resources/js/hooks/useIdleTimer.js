import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Timeout per user role (in minutes)
const ROLE_TIMEOUTS = {
    author:            30,
    researcher:        30,
    reviewer:          25,
    editor:            17,
    office:            15,
    production_office: 15,
    committee:         20,
    chair:             12,
    admin:              7,
};

// Warning shown 1 minute before logout
const WARNING_BEFORE_MS = 60 * 1000;

// Events that reset the idle timer
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];

/**
 * useIdleTimer
 * @param {Function} onWarn  - called when 1 minute remains (show warning modal)
 * @param {Function} onLogout - called when session expires (do logout)
 */
export default function useIdleTimer(onWarn, onLogout) {
    const navigate  = useNavigate();
    const timerRef  = useRef(null);
    const warnRef   = useRef(null);
    const warnedRef = useRef(false);

    const getTimeoutMs = useCallback(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const role = user?.user_type || 'committee';
            const minutes = ROLE_TIMEOUTS[role] ?? 20;
            return minutes * 60 * 1000;
        } catch {
            return 20 * 60 * 1000;
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout) onLogout();
        navigate('/login', { state: { message: 'تم تسجيل خروجك تلقائياً بسبب عدم النشاط.' } });
    }, [navigate, onLogout]);

    const resetTimer = useCallback(() => {
        clearTimeout(timerRef.current);
        clearTimeout(warnRef.current);
        warnedRef.current = false;

        const totalMs  = getTimeoutMs();
        const warnAt   = totalMs - WARNING_BEFORE_MS;

        // Schedule warning 1 minute before logout
        warnRef.current = setTimeout(() => {
            if (!warnedRef.current) {
                warnedRef.current = true;
                if (onWarn) onWarn();
            }
        }, warnAt);

        // Schedule actual logout
        timerRef.current = setTimeout(() => {
            handleLogout();
        }, totalMs);
    }, [getTimeoutMs, handleLogout, onWarn]);

    useEffect(() => {
        resetTimer();

        ACTIVITY_EVENTS.forEach(evt =>
            window.addEventListener(evt, resetTimer, { passive: true })
        );

        return () => {
            clearTimeout(timerRef.current);
            clearTimeout(warnRef.current);
            ACTIVITY_EVENTS.forEach(evt =>
                window.removeEventListener(evt, resetTimer)
            );
        };
    }, [resetTimer]);

    // expose resetTimer so the warning modal "Continue" button can reset it
    return { resetTimer };
}
