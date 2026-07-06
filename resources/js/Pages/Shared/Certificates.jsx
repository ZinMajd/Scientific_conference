import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Helper to format date in Arabic
function formatDateAr(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function CertificateDocument({ cert, authorName }) {
    const conf = cert.conference;
    const today = formatDateAr(new Date().toISOString().slice(0, 10));
    const confTitle = conf?.title || 'المؤتمر العلمي';
    const venue = conf?.venue || 'جامعة إقليم سبأ';
    const confDates = conf?.start_date
        ? `${formatDateAr(conf.start_date)}${conf.end_date ? ' — ' + formatDateAr(conf.end_date) : ''}`
        : '';
    const decisionDate = formatDateAr(cert.decision_date);

    return (
        <div
            id={`cert-${cert.id}`}
            style={{
                width: '794px',
                minHeight: '560px',
                background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Cairo', 'Amiri', serif",
                direction: 'rtl',
                borderRadius: '8px',
            }}
        >
            {/* Gold decorative borders */}
            <div style={{ position: 'absolute', inset: '12px', border: '2px solid rgba(212,175,55,0.5)', borderRadius: '4px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: '18px', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '2px', pointerEvents: 'none' }} />

            {/* Corner ornaments */}
            {['top:12px;right:12px', 'top:12px;left:12px', 'bottom:12px;right:12px', 'bottom:12px;left:12px'].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', width: '40px', height: '40px', ...Object.fromEntries(pos.split(';').map(p => p.split(':'))), borderColor: '#d4af37', opacity: 0.7, borderStyle: 'solid', borderTopWidth: i < 2 ? '3px' : '0', borderBottomWidth: i >= 2 ? '3px' : '0', borderRightWidth: i % 2 === 0 ? '3px' : '0', borderLeftWidth: i % 2 === 1 ? '3px' : '0' }} />
            ))}

            {/* Background watermark star */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '320px', opacity: 0.03, color: '#d4af37', userSelect: 'none', pointerEvents: 'none' }}>★</div>

            <div style={{ position: 'relative', zIndex: 1, padding: '48px 60px', textAlign: 'center', color: '#fff' }}>
                {/* University & Conference Header */}
                <div style={{ marginBottom: '8px' }}>
                    <div style={{ color: '#d4af37', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '600' }}>جامعة إقليم سبأ</div>
                    <div style={{ width: '80px', height: '1px', background: 'linear-gradient(to right, transparent, #d4af37, transparent)', margin: '0 auto 8px' }} />
                    <h2 style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: '400', margin: 0 }}>{confTitle}</h2>
                </div>

                {/* Certificate Title */}
                <div style={{ margin: '24px 0 20px' }}>
                    <h1 style={{ fontSize: '38px', fontWeight: '900', background: 'linear-gradient(135deg, #d4af37, #f5d97a, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, lineHeight: 1.2 }}>
                        شهادة قبول بحث
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6))' }} />
                        <span style={{ color: '#d4af37', fontSize: '18px' }}>❖</span>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.6))' }} />
                    </div>
                </div>

                {/* Preamble text */}
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.8 }}>
                    تُشهد اللجنة العلمية للمؤتمر بأن
                </p>

                {/* Author Name */}
                <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px', padding: '12px 40px', display: 'inline-block', marginBottom: '20px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '700', color: '#f5d97a', letterSpacing: '1px' }}>{authorName}</span>
                </div>

                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '16px' }}>
                    قد استوفى بحثه المقدم جميع الاشتراطات العلمية والأكاديمية المعتمدة، وقد تمّ قبوله رسمياً للنشر والمشاركة في
                </p>

                {/* Paper title */}
                <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '4px', padding: '16px 32px', marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ color: '#64748b', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>عنوان البحث</div>
                    <p style={{ fontSize: '16px', color: '#e2e8f0', fontWeight: '700', margin: 0, lineHeight: 1.6 }}>
                        "{cert.title}"
                    </p>
                </div>

                {/* Conference details */}
                {confDates && (
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                        المُقام في <span style={{ color: '#d4af37' }}>{venue}</span>
                        {confDates && <> خلال الفترة <span style={{ color: '#d4af37' }}>{confDates}</span></>}
                    </p>
                )}

                {/* Divider */}
                <div style={{ width: '120px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)', margin: '20px auto' }} />

                {/* Footer: Date & Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#64748b', fontSize: '10px', letterSpacing: '1px', marginBottom: '4px' }}>تاريخ الإصدار</div>
                        <div style={{ color: '#d4af37', fontSize: '13px', fontWeight: '600' }}>{today}</div>
                        {decisionDate && (
                            <>
                                <div style={{ color: '#64748b', fontSize: '10px', letterSpacing: '1px', marginTop: '8px', marginBottom: '4px' }}>تاريخ قرار القبول</div>
                                <div style={{ color: '#d4af37', fontSize: '13px', fontWeight: '600' }}>{decisionDate}</div>
                            </>
                        )}
                    </div>

                    {/* Seal */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid rgba(212,175,55,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,175,55,0.05)', margin: '0 auto' }}>
                            <div style={{ fontSize: '22px' }}>🏛️</div>
                            <div style={{ fontSize: '7px', color: '#d4af37', marginTop: '4px', lineHeight: 1.3, textAlign: 'center' }}>ختم رسمي<br />جامعة إقليم سبأ</div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <div style={{ color: '#64748b', fontSize: '10px', letterSpacing: '1px', marginBottom: '4px' }}>رئيس اللجنة العلمية</div>
                        <div style={{ width: '120px', height: '1px', background: 'rgba(212,175,55,0.4)', marginBottom: '4px' }} />
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>التوقيع والختم الرسمي</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [printingId, setPrintingId] = useState(null);

    useEffect(() => {
        axios.get('/researcher/certificates')
            .then(res => {
                // Handle both plain array and paginated/wrapped responses
                const data = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];
                setCertificates(data);
                setLoading(false);
            })
            .catch(() => { setError('فشل في تحميل الشهادات.'); setLoading(false); });
    }, []);

    const handlePrint = (cert) => {
        setPrintingId(cert.id);
        setTimeout(() => {
            const el = document.getElementById(`cert-${cert.id}`);
            if (!el) return;
            const w = window.open('', '_blank', 'width=900,height=700');
            w.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>شهادة قبول بحث - ${cert.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    @media print {
      body { margin:0; }
      @page { size: A4 landscape; margin: 0; }
    }
  </style>
</head>
<body>
${el.outerHTML}
<script>
  window.onload = function() {
    setTimeout(function(){ window.print(); }, 500);
  };
<\/script>
</body>
</html>`);
            w.document.close();
            setPrintingId(null);
        }, 100);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 font-['Cairo']">الشهادات والوثائق</h1>
                    <p className="text-gray-500 font-medium mt-1">تحميل شهادات الحضور، المشاركة، وخطابات القبول الرسمية</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-sm text-amber-700 font-medium">
                    📜 {certificates.length} شهادة متاحة
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600">{error}</div>
            )}

            {!loading && !error && certificates.length === 0 && (
                <div className="bg-white p-20 rounded-[4rem] text-center border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-6">📜</div>
                    <h3 className="text-xl font-bold text-gray-400">لا توجد شهادات متاحة حالياً</h3>
                    <p className="text-gray-300 text-sm mt-2 max-w-sm mx-auto font-medium">
                        تظهر شهادة القبول تلقائياً بمجرد قبول بحثك من قبل اللجنة العلمية.
                    </p>
                </div>
            )}

            {/* Certificates List */}
            {!loading && certificates.map(cert => (
                <div key={cert.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white font-bold shadow-sm">
                                📜
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 font-['Cairo']">شهادة قبول بحث</div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                    {cert.conference?.short_name || cert.conference?.title || 'المؤتمر العلمي'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handlePrint(cert)}
                            disabled={printingId === cert.id}
                            className="flex items-center gap-2 bg-gradient-to-l from-blue-700 to-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait font-['Cairo']"
                        >
                            {printingId === cert.id ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري الفتح...</>
                            ) : (
                                <><span>🖨️</span> طباعة / تحميل PDF</>
                            )}
                        </button>
                    </div>

                    {/* Certificate Preview */}
                    <div className="p-6 flex justify-center bg-gray-50">
                        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-140px' }}>
                            <CertificateDocument cert={cert} authorName={cert.author_name} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
