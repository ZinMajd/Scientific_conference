<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conference;
use App\Models\User;

class ExtraConferencesSeeder extends Seeder
{
    public function run()
    {
        $admin = User::where('email', 'admin@sabauni.edu.ye')->first();
        if (!$admin) {
            // Fallback if admin doesn't exist, though it should
            $admin = User::first();
        }

        $conferences = [
            [
                'chair_id' => $admin->id,
                'title' => 'المؤتمر الوطني للطاقة المتجددة في اليمن 2026',
                'description' => 'يناقش المؤتمر مستقبل الطاقة المتجددة (الشمسية، الرياح) في اليمن وتحديات الشبكة الوطنية.',
                'short_name' => 'YE-Energy',
                'venue' => 'فندق بلقيس - مأرب',
                'start_date' => '2026-06-10',
                'end_date' => '2026-06-12',
                'submission_deadline' => '2026-04-15 23:59:59',
                'review_deadline' => '2026-05-15 23:59:59',
                'notification_date' => '2026-05-25 23:59:59',
                'status' => 'open',
                'contact_email' => 'energy@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'مؤتمر سد مأرب وتاريخ الحضارة اليمنية القديمة',
                'description' => 'يسلط الضوء على الاكتشافات الأثرية الحديثة والدراسات التاريخية حول مملكة سبأ وسد مأرب.',
                'short_name' => 'SabaHistory',
                'venue' => 'قاعة المؤتمرات - سد مأرب',
                'start_date' => '2026-09-20',
                'end_date' => '2026-09-22',
                'submission_deadline' => '2026-07-01 23:59:59',
                'review_deadline' => '2026-08-15 23:59:59',
                'notification_date' => '2026-08-30 23:59:59',
                'status' => 'open',
                'contact_email' => 'history@sabauni.edu.ye'
            ],
            [
                'chair_id' => $admin->id,
                'title' => 'ملتقى الابتكار الزراعي والأمن الغذائي',
                'description' => 'يركز على التقنيات الحديثة في الزراعة الصحراوية وإدارة الموارد المائية في المناطق الجافة.',
                'short_name' => 'AgriTech',
                'venue' => 'كلية الزراعة - جامعة إقليم سبأ',
                'start_date' => '2026-11-05',
                'end_date' => '2026-11-07',
                'submission_deadline' => '2026-09-01 23:59:59',
                'review_deadline' => '2026-10-01 23:59:59',
                'notification_date' => '2026-10-15 23:59:59',
                'status' => 'open',
                'contact_email' => 'agri@sabauni.edu.ye'
            ]
        ];

        foreach ($conferences as $conf) {
            Conference::firstOrCreate(
                ['short_name' => $conf['short_name']],
                $conf
            );
        }
    }
}
