<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conference;

class ConferenceSeeder extends Seeder
{
    public function run(): void
    {
        Conference::create([
            'title' => 'المؤتمر الدولي للذكاء الاصطناعي 2026',
            'description' => 'مؤتمر يجمع نخبة من الخبراء لمناقشة مستقبل الذكاء الاصطناعي وتطبيقاته في مختلف المجالات.',
            'location' => 'مأرب، اليمن',
            'start_date' => '2026-03-25',
            'end_date' => '2026-03-27',
            'status' => 'active',
            'image_url' => '/images/conf_ai.png',
        ]);

        Conference::create([
            'title' => 'مؤتمر الأمن السيبراني والتقنيات الحديثة',
            'description' => 'استعراض أحدث التهديدات والحلول في عالم الأمن السيبراني وحماية البيانات.',
            'location' => 'مأرب، اليمن',
            'start_date' => '2026-05-10',
            'end_date' => '2026-05-12',
            'status' => 'active',
            'image_url' => '/images/conf_cyber.png',
        ]);

        Conference::create([
            'title' => 'ملتقى الابتكار وريادة الأعمال',
            'description' => 'منصة لرواد الأعمال والمبتكرين لعرض أفكارهم ومشاريعهم.',
            'location' => 'مأرب، اليمن',
            'start_date' => '2026-09-15',
            'end_date' => '2026-09-17',
            'status' => 'upcoming',
            'image_url' => '/images/conf_innovation.png',
        ]);

        Conference::create([
            'title' => 'مؤتمر تكنولوجيا الطاقة المتجددة 2024',
            'description' => 'بحث سبل استغلال الطاقة المتجددة لتحقيق التنمية المستدامة في الإقليم.',
            'location' => 'مأرب، اليمن',
            'start_date' => '2024-02-10',
            'end_date' => '2024-02-12',
            'status' => 'expired',
            'image_url' => '/images/conf_innovation.png',
        ]);
    }
}
