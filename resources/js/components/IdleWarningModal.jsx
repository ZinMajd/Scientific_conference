import React from 'react';

const TURQUOISE = '#40E0D0';
const PRUSSIAN  = '#105d82';

/**
 * IdleWarningModal
 * @param {boolean}  visible
 * @param {Function} onContinue - user clicked "Continue"
 * @param {Function} onLogout   - user clicked "Logout"
 * @param {number}   secondsLeft - countdown shown in the modal
 */
export default function IdleWarningModal({ visible, onContinue, onLogout, secondsLeft = 60 }) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            dir="rtl"
        >
            <div
                className="bg-white w-full max-w-md mx-4 shadow-2xl overflow-hidden"
                style={{ border: `2px solid ${TURQUOISE}` }}
            >
                {/* Header */}
                <div className="p-6 text-white text-center" style={{ background: PRUSSIAN }}>
                    <div className="text-4xl mb-3">⏱️</div>
                    <h2 className="text-xl font-black">تنبيه انتهاء الجلسة</h2>
                </div>

                {/* Body */}
                <div className="p-8 text-center space-y-4">
                    <p className="text-gray-700 font-bold text-base leading-relaxed">
                        ستنتهي جلستك خلال{' '}
                        <span className="font-black text-2xl" style={{ color: PRUSSIAN }}>
                            {secondsLeft}
                        </span>{' '}
                        ثانية بسبب عدم النشاط.
                    </p>
                    <p className="text-gray-500 text-sm">هل تريد الاستمرار في الجلسة؟</p>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="flex-1 py-4 font-bold text-red-500 hover:bg-red-50 transition text-sm"
                    >
                        تسجيل الخروج الآن
                    </button>
                    <div className="w-px bg-gray-100" />
                    <button
                        onClick={onContinue}
                        className="flex-1 py-4 font-black text-white transition text-sm hover:opacity-90"
                        style={{ background: PRUSSIAN }}
                    >
                        ✅ الاستمرار في الجلسة
                    </button>
                </div>
            </div>
        </div>
    );
}
