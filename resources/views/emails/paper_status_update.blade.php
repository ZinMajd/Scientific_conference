@extends('emails.layout')

@section('content')
    <p class="greeting">مرحباً {{ $user->full_name }}،</p>
    <p class="intro">
        لدينا تحديث مهم بخصوص بحثك العلمي المُقدَّم لمؤتمرنا.
    </p>

    @php
        $statusConfig = [
            'under_screening'               => ['badge' => 'status-info',    'label' => '🔍 قيد الفرز التقني',         'color' => '#0d47a1'],
            'with_editor'                   => ['badge' => 'status-info',    'label' => '📋 مع المحرر العلمي',         'color' => '#0d47a1'],
            'preliminary_accepted'          => ['badge' => 'status-success', 'label' => '✅ مقبول مبدئياً',            'color' => '#2e7d32'],
            'ready_for_review'              => ['badge' => 'status-info',    'label' => '📤 جاهز للتحكيم',             'color' => '#0d47a1'],
            'under_review'                  => ['badge' => 'status-info',    'label' => '⚖️ قيد التحكيم العلمي',      'color' => '#0d47a1'],
            'accepted'                      => ['badge' => 'status-success', 'label' => '🎉 مقبول نهائياً',            'color' => '#2e7d32'],
            'rejected'                      => ['badge' => 'status-danger',  'label' => '❌ مرفوض',                    'color' => '#c62828'],
            'revision_required'             => ['badge' => 'status-warning', 'label' => '📝 يتطلب تعديلات',           'color' => '#e65100'],
            'resubmitted'                   => ['badge' => 'status-info',    'label' => '🔄 أُعيد تقديمه',             'color' => '#0d47a1'],
            'scheduled'                     => ['badge' => 'status-success', 'label' => '📅 مجدول في المؤتمر',         'color' => '#2e7d32'],
            'in_production'                 => ['badge' => 'status-info',    'label' => '🖨️ قيد الإنتاج',             'color' => '#0d47a1'],
            'ready_to_publish'              => ['badge' => 'status-success', 'label' => '📚 جاهز للنشر',               'color' => '#2e7d32'],
            'production_revision_required'  => ['badge' => 'status-warning', 'label' => '✏️ يتطلب تعديل إنتاجي',      'color' => '#e65100'],
            'published'                     => ['badge' => 'status-success', 'label' => '🌍 منشور',                    'color' => '#2e7d32'],
        ];
        $config = $statusConfig[$newStatus] ?? ['badge' => 'status-info', 'label' => $newStatus, 'color' => '#0d47a1'];
    @endphp

    <span class="status-badge {{ $config['badge'] }}">{{ $config['label'] }}</span>

    <div class="paper-card">
        <div class="label">البحث المُحدَّثة حالته</div>
        <div class="title">{{ $paper->title }}</div>
        <div class="meta">رقم البحث: #{{ $paper->id }}</div>
    </div>

    @if($notes)
        <div class="message-box {{ in_array($newStatus, ['rejected','revision_required','production_revision_required']) ? 'warning' : '' }}">
            <strong>ملاحظات اللجنة:</strong><br>
            {{ $notes }}
        </div>
    @endif

    @if($newStatus === 'accepted')
        <div class="message-box success">
            🎉 تهانينا! تم قبول بحثك نهائياً في مؤتمرنا العلمي. ستتلقى تفاصيل العرض والجدولة قريباً.
        </div>
    @elseif($newStatus === 'rejected')
        <div class="message-box danger">
            نأسف لإبلاغك بأن بحثك لم يستوفِ متطلبات القبول في هذه المرحلة. يمكنك مراجعة التقييم والتقديم مستقبلاً.
        </div>
    @elseif($newStatus === 'revision_required' || $newStatus === 'production_revision_required')
        <div class="message-box warning">
            ⚠️ يرجى مراجعة الملاحظات أعلاه وإعادة تقديم البحث المعدَّل في أقرب وقت ممكن.
        </div>
    @elseif($newStatus === 'published')
        <div class="message-box success">
            🌍 يسعدنا إعلامك بنشر بحثك رسمياً ضمن منشورات مؤتمرنا العلمي.
        </div>
    @endif

    <a href="{{ url('/researcher/research') }}" class="cta-button">عرض تفاصيل البحث كاملة</a>
@endsection
