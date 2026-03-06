<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conference;
use App\Models\User;

class TechConferencesSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('email', 'admin@sabauni.edu.ye')->first();
        if (!$admin) {
            $admin = User::first();
        }

        $conferences = [
            [
                'chair_id' => $admin->id,
                'title' => 'المؤتمر الوطني للأمن السيبراني وحماية البيانات 2026',
                'description' => 'يركز المؤتمر على استراتيجيات الدفاع السيبراني، حماية الخصوصية، وأمن المعلومات في العصر الرقمي.',
                'short_name' => 'CyberSec-2026',
                'venue' => 'مركز المؤتمرات - جامعة إقليم سبأ',
                'start_date' => '2026-04-10',
                'end_date' => '2026-04-12',
                'submission_deadline' => '2026-02-28 23:59:59',
                'review_deadline' => '2026-03-15 23:59:59',
                'notification_date' => '2026-03-25 23:59:59',
                'status' => 'open',
                'contact_email' => 'cyber@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'المؤتمر الدولي للذكاء الاصطناعي والأنظمة الذكية 2026',
                'description' => 'تطبيقات الذكاء الاصطناعي، تعلم الآلة، الروبوتات، ومعالجة اللغات الطبيعية.',
                'short_name' => 'AI-Systems-2026',
                'venue' => 'القاعة الذكية - كلية الحاسوب',
                'start_date' => '2026-05-15',
                'end_date' => '2026-05-17',
                'submission_deadline' => '2026-03-30 23:59:59',
                'review_deadline' => '2026-04-15 23:59:59',
                'notification_date' => '2026-04-25 23:59:59',
                'status' => 'open',
                'contact_email' => 'ai@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'مؤتمر الاتصالات المتنقلة وتقنيات إنترنت الأشياء (IoT)',
                'description' => 'شبكات الجيل الخامس والسادس، أنظمة اتصالات المحمول، وتطبيقات إنترنت الأشياء في المدن الذكية.',
                'short_name' => 'Mobile-IoT-2026',
                'venue' => 'قاعة تكنولوجيا الاتصالات',
                'start_date' => '2026-07-05',
                'end_date' => '2026-07-07',
                'submission_deadline' => '2026-05-10 23:59:59',
                'review_deadline' => '2026-06-05 23:59:59',
                'notification_date' => '2026-06-15 23:59:59',
                'status' => 'open',
                'contact_email' => 'telecom@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'مؤتمر الشبكات والحوسبة السحابية وأمن مراكز البيانات',
                'description' => 'تطوير البنية التحتية، السحابة الهجينة، إدارة مراكز البيانات الكبيرة، وأمن الشبكات المتقدم.',
                'short_name' => 'Cloud-Net-2026',
                'venue' => 'مركز المعلومات الوطني',
                'start_date' => '2026-08-12',
                'end_date' => '2026-08-14',
                'submission_deadline' => '2026-06-15 23:59:59',
                'review_deadline' => '2026-07-10 23:59:59',
                'notification_date' => '2026-07-20 23:59:59',
                'status' => 'open',
                'contact_email' => 'network@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'مؤتمر أمن المعلومات والبحوث التقنية الحديثة',
                'description' => 'آخر البحوث في التشفير، الهوية الرقمية، والتقنيات الناشئة في حماية المعلومات.',
                'short_name' => 'InfoSec-Tech-2026',
                'venue' => 'كلية الهندسة والتقنية',
                'start_date' => '2026-10-18',
                'end_date' => '2026-10-20',
                'submission_deadline' => '2026-08-20 23:59:59',
                'review_deadline' => '2026-09-15 23:59:59',
                'notification_date' => '2026-09-25 23:59:59',
                'status' => 'open',
                'contact_email' => 'infosec@sabauni.edu.ye'
            ]
        ];

        foreach ($conferences as $conf) {
            Conference::updateOrCreate(
                ['short_name' => $conf['short_name']],
                $conf
            );
        }
    }
}
