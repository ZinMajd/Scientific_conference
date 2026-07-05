<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'إشعار من المؤتمر العلمي' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            background-color: #f0f4f8;
            direction: rtl;
            color: #1a202c;
        }
        .wrapper {
            max-width: 620px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #0a4a68 0%, #105d82 60%, #0096c7 100%);
            padding: 36px 40px;
            text-align: center;
        }
        .header .logo-badge {
            width: 64px; height: 64px;
            background: rgba(255,255,255,0.15);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 16px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .header p {
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            margin-top: 6px;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0a4a68;
            margin-bottom: 12px;
        }
        .intro {
            font-size: 15px;
            color: #4a5568;
            line-height: 1.7;
            margin-bottom: 28px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 18px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 24px;
        }
        .status-success { background: #e8f5e9; color: #2e7d32; }
        .status-warning { background: #fff8e1; color: #e65100; }
        .status-info    { background: #e3f2fd; color: #0d47a1; }
        .status-danger  { background: #fce4ec; color: #c62828; }
        .paper-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 28px;
        }
        .paper-card .label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #718096;
            margin-bottom: 6px;
        }
        .paper-card .title {
            font-size: 16px;
            font-weight: 700;
            color: #1a202c;
            line-height: 1.5;
        }
        .paper-card .meta {
            font-size: 13px;
            color: #718096;
            margin-top: 8px;
        }
        .info-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 14px 0;
            border-bottom: 1px solid #f0f4f8;
        }
        .info-row:last-child { border-bottom: none; }
        .info-row .icon {
            font-size: 18px;
            margin-top: 2px;
            flex-shrink: 0;
        }
        .info-row .text strong {
            display: block;
            font-size: 13px;
            color: #718096;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .info-row .text span {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
        }
        .cta-button {
            display: block;
            width: fit-content;
            margin: 28px auto 0;
            padding: 14px 40px;
            background: linear-gradient(135deg, #105d82, #0096c7);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.5px;
        }
        .message-box {
            background: #f0f9ff;
            border-right: 4px solid #0096c7;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
            font-size: 14px;
            color: #2d3748;
            line-height: 1.7;
        }
        .message-box.warning {
            background: #fffbeb;
            border-color: #f59e0b;
        }
        .message-box.success {
            background: #f0fff4;
            border-color: #22c55e;
        }
        .message-box.danger {
            background: #fff1f2;
            border-color: #ef4444;
        }
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 28px 0;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 24px 40px;
            text-align: center;
        }
        .footer p {
            font-size: 12px;
            color: #a0aec0;
            line-height: 1.7;
        }
        .footer .university {
            font-size: 13px;
            font-weight: 700;
            color: #718096;
            margin-bottom: 6px;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <div class="logo-badge">🏛️</div>
        <h1>نظام المؤتمرات العلمية</h1>
        <p>جامعة إقليم سبأ</p>
    </div>

    <div class="content">
        @yield('content')
    </div>

    <div class="footer">
        <p class="university">جامعة إقليم سبأ — نظام إدارة المؤتمرات العلمية</p>
        <p>هذه رسالة آلية. يرجى عدم الرد عليها مباشرة.<br>
        للتواصل: <a href="mailto:support@conference.example.com" style="color: #0096c7;">support@conference.example.com</a></p>
    </div>
</div>
</body>
</html>
