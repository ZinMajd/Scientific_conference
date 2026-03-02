<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        // Add Topics
        $topics = [
            ['name' => 'علوم الحاسوب', 'description' => 'مجال علوم الحاسوب وتقنية المعلومات'],
            ['name' => 'الهندسة', 'description' => 'مجالات الهندسة المختلفة'],
            ['name' => 'الطب والعلوم الصحية', 'description' => 'العلوم الطبية والصحية'],
            ['name' => 'العلوم الاجتماعية', 'description' => 'العلوم الاجتماعية والإنسانية'],
            ['name' => 'الاقتصاد والإدارة', 'description' => 'العلوم الاقتصادية والإدارية'],
            ['name' => 'اللغة العربية', 'description' => 'الدراسات اللغوية والأدبية'],
            ['name' => 'الدراسات الإسلامية', 'description' => 'العلوم الشرعية والدراسات الإسلامية'],
        ];

        foreach ($topics as $topic) {
            Topic::firstOrCreate(['name' => $topic['name']], $topic);
        }

        $this->call(RolesAndPermissionsSeeder::class);

        // Add Admin User
        $admin = User::where('email', 'admin@sabauni.edu.ye')->first();
        if (!$admin) {
            $admin = User::create([
                'username' => 'admin',
                'email' => 'admin@sabauni.edu.ye',
                'password' => Hash::make('password123'),
                'user_type' => 'chair',
                'full_name' => 'مدير النظام',
                'affiliation' => 'جامعة إقليم سبأ',
                'is_active' => true,
            ]);
        }

        $adminRole = \App\Models\Role::where('slug', 'system_admin')->first();
        if ($adminRole && !$admin->roles()->where('slug', 'system_admin')->exists()) {
            $admin->roles()->attach($adminRole->id);
        }

        // Add Sample Conference
        if (\App\Models\Conference::where('short_name', 'SabaAI-2026')->count() === 0) {
            \App\Models\Conference::create([
                'chair_id' => $admin->id,
                'title' => 'المؤتمر الدولي الأول للذكاء الاصطناعي 2026',
                'description' => 'يهدف المؤتمر لمناقشة تطبيقات الذكاء الاصطناعي في خدمة المجتمع والتنمية المستدامة في إقليم سبأ.',
                'short_name' => 'SabaAI-2026',
                'venue' => 'القاعة الكبرى - جامعة إقليم سبأ',
                'start_date' => '2026-03-25',
                'end_date' => '2026-03-27',
                'submission_deadline' => '2026-02-15 23:59:59',
                'review_deadline' => '2026-03-05 23:59:59',
                'notification_date' => '2026-03-10 23:59:59',
                'status' => 'open',
                'contact_email' => 'conference@sabauni.edu.ye'
            ]);
        }

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
    }
}
