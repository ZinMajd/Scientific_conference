@extends('emails.layout')

@section('content')
    <p class="greeting">مرحباً {{ $user->full_name }}،</p>
    <p class="intro">
        نُبشّرك بأن بحثك العلمي قد وصل إلينا وتم تسجيله بنجاح في منظومة المؤتمر.
        سنتواصل معك عند كل تحديث في حالة البحث.
    </p>

    <div class="paper-card">
        <div class="label">تفاصيل البحث المُقدَّم</div>
        <div class="title">{{ $paper->title }}</div>
        <div class="meta">
            رقم البحث: #{{ $paper->id }}
            @if($paper->conference)
                &nbsp;|&nbsp; المؤتمر: {{ $paper->conference->title ?? 'غير محدد' }}
            @endif
        </div>
    </div>

    <div class="message-box success">
        ✅ <strong>حالة البحث الحالية:</strong> تحت المراجعة الأولية (الفرز التقني)<br>
        سيقوم فريق التحرير بمراجعة الامتثال الفني لبحثك خلال أيام قليلة.
    </div>

    <div class="info-row">
        <span class="icon">📅</span>
        <div class="text">
            <strong>تاريخ التقديم</strong>
            <span>{{ now()->format('Y/m/d H:i') }}</span>
        </div>
    </div>
    <div class="info-row">
        <span class="icon">⏳</span>
        <div class="text">
            <strong>المرحلة التالية</strong>
            <span>الفرز التقني والمراجعة المبدئية (3-7 أيام عمل)</span>
        </div>
    </div>

    <a href="{{ url('/researcher/research') }}" class="cta-button">📊 متابعة حالة البحث</a>
@endsection
