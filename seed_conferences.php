<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Conference;
use App\Models\User;
use Carbon\Carbon;

$admin = User::first() ?? User::factory()->create();

$conf1 = Conference::create([
    'title' => 'المؤتمر العلمي الدولي الأول لتكنولوجيا المعلومات والذكاء الاصطناعي',
    'short_name' => 'ITAI-2026',
    'description' => 'مؤتمر دولي يهدف إلى جمع الباحثين والخبراء لمناقشة أحدث التطورات في مجالات الذكاء الاصطناعي، الأمن السيبراني، وهندسة البرمجيات.',
    'status' => 'open',
    'chair_id' => $admin->id,
    'venue' => 'جامعة إقليم سبأ - القاعة الكبرى',
    'image_url' => '/images/conf_ai.png',
    'start_date' => Carbon::now()->addMonths(2)->format('Y-m-d'),
    'end_date' => Carbon::now()->addMonths(2)->addDays(3)->format('Y-m-d'),
    'submission_deadline' => Carbon::now()->addDays(20)->format('Y-m-d'),
    'review_deadline' => Carbon::now()->addDays(40)->format('Y-m-d'),
    'notification_date' => Carbon::now()->addDays(45)->format('Y-m-d'),
    'camera_ready_deadline' => Carbon::now()->addDays(50)->format('Y-m-d'),
    'registration_deadline' => Carbon::now()->addDays(55)->format('Y-m-d'),
    'contact_email' => 'itai2026@sabauni.edu.ye',
]);

$conf2 = Conference::create([
    'title' => 'المؤتمر العلمي لرواد التنمية المستدامة والعلوم الإدارية',
    'short_name' => 'SDAS-2026',
    'description' => 'منصة رائدة لمناقشة التحديات الاقتصادية والإدارية الحديثة وسبل تحقيق التنمية المستدامة في المؤسسات الأكاديمية والعملية.',
    'status' => 'open',
    'chair_id' => $admin->id,
    'venue' => 'جامعة إقليم سبأ - كلية العلوم الإدارية',
    'image_url' => '/images/conf_innovation.png',
    'start_date' => Carbon::now()->addMonths(4)->format('Y-m-d'),
    'end_date' => Carbon::now()->addMonths(4)->addDays(2)->format('Y-m-d'),
    'submission_deadline' => Carbon::now()->addMonths(1)->format('Y-m-d'),
    'review_deadline' => Carbon::now()->addMonths(2)->format('Y-m-d'),
    'notification_date' => Carbon::now()->addMonths(2)->addDays(15)->format('Y-m-d'),
    'camera_ready_deadline' => Carbon::now()->addMonths(3)->format('Y-m-d'),
    'registration_deadline' => Carbon::now()->addMonths(3)->addDays(15)->format('Y-m-d'),
    'contact_email' => 'sdas2026@sabauni.edu.ye',
]);

echo "Successfully added:\n1. " . $conf1->title . "\n2. " . $conf2->title . "\n";
