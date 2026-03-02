<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conference;

class ConferenceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = \App\Models\User::first();
        if (!$admin)
            return;

        Conference::create([
            'chair_id' => $admin->id,
            'title' => 'المؤتمر الدولي للذكاء الاصطناعي 2026',
            'description' => 'مؤتمر يجمع نخبة من الخبراء لمناقشة مستقبل الذكاء الاصطناعي وتطبيقاته في مختلف المجالات.',
            'venue' => 'مأرب، اليمن',
            'start_date' => '2026-03-25',
            'end_date' => '2026-03-27',
            'submission_deadline' => '2026-02-15 23:59:59',
            'review_deadline' => '2026-03-05 23:59:59',
            'notification_date' => '2026-03-10 23:59:59',
            'status' => 'open',
            'website_url' => 'https://example.com',
        ]);
    }
}
