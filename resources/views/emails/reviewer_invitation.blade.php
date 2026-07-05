@extends('emails.layout')

@section('content')
    <p class="greeting">مرحباً د. {{ $reviewerName }}،</p>
    <p class="intro">
        يسعدنا دعوتكم للمشاركة في لجنة التحكيم العلمي لمؤتمرنا البحثي.
        نقدّر خبرتكم العلمية ونأمل في الاستفادة من رأيكم المتخصص.
    </p>

    <div class="paper-card">
        <div class="label">بيانات الدعوة</div>
        <div class="title">{{ $reviewerName }}</div>
        <div class="meta">{{ $affiliation ?? 'جهة خارجية' }}</div>
    </div>

    <div class="message-box success">
        ✉️ تم إرسال هذه الدعوة من قِبل اللجنة العلمية لجامعة إقليم سبأ.<br>
        لإتمام تسجيلكم كمحكم في المنظومة، يرجى الضغط على الرابط أدناه.
    </div>

    <div style="background:#f8fafc; border:1px dashed #cbd5e0; border-radius:12px; padding:20px; margin: 20px 0; text-align:center;">
        <p style="font-size:13px; color:#718096; margin-bottom:12px;">رابط التسجيل الخاص بكم (صالح لمدة 7 أيام):</p>
        <a href="{{ $invitationLink }}" style="font-family:monospace; font-size:13px; color:#0096c7; word-break:break-all;">
            {{ $invitationLink }}
        </a>
    </div>

    <div class="info-row">
        <span class="icon">📅</span>
        <div class="text">
            <strong>تاريخ انتهاء صلاحية الرابط</strong>
            <span>{{ now()->addDays(7)->format('Y/m/d') }}</span>
        </div>
    </div>
    <div class="info-row">
        <span class="icon">🔒</span>
        <div class="text">
            <strong>الخصوصية</strong>
            <span>هذا الرابط شخصي ومخصص لكم فقط. لا تشاركوه مع أحد.</span>
        </div>
    </div>

    <a href="{{ $invitationLink }}" class="cta-button">🏛️ إتمام التسجيل كمحكم</a>

    <hr class="divider">
    <p style="font-size:13px; color:#718096; text-align:center;">
        إذا لم تتوقعوا هذه الرسالة أو لا ترغبون في الانضمام، يمكنكم تجاهل هذا البريد.
    </p>
@endsection
