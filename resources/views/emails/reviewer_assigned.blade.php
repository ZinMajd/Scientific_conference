@extends('emails.layout')

@section('content')
    <p class="greeting">مرحباً {{ $reviewerName }}،</p>
    <p class="intro">
        نُحيطكم علماً بأنه قد تم تعيينكم محكماً علمياً لمراجعة البحث التالي. نأمل منكم إتمام عملية التحكيم في الموعد المحدد.
    </p>

    <div class="paper-card">
        <div class="label">البحث المُخصَّص للتحكيم</div>
        <div class="title">{{ $paperTitle }}</div>
        <div class="meta">رقم المهمة: #{{ $assignmentId }}</div>
    </div>

    <div class="message-box">
        ⚖️ يُرجى العلم بأن هوية المؤلف محجوبة في النسخة المُرسلة إليكم حفاظاً على مبدأ التحكيم الأعمى المزدوج (Double Blind Review).
    </div>

    <div class="info-row">
        <span class="icon">📅</span>
        <div class="text">
            <strong>الموعد النهائي للتحكيم</strong>
            <span>{{ $dueDate }}</span>
        </div>
    </div>
    <div class="info-row">
        <span class="icon">📋</span>
        <div class="text">
            <strong>المطلوب منكم</strong>
            <span>تقييم البحث علمياً وملء نموذج التحكيم عبر المنصة</span>
        </div>
    </div>

    <a href="{{ url('/reviewer/assignments') }}" class="cta-button">⚖️ عرض مهمة التحكيم</a>
@endsection
