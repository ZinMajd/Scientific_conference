<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ─────────────────────────────────────────────
        // 1. تعريف جميع الصلاحيات مع مجموعاتها
        // ─────────────────────────────────────────────
        $permissions = [
            // ── الصفحات العامة ──
            ['slug' => 'home.view',                    'name' => 'عرض الصفحة الرئيسية'],
            ['slug' => 'about.view',                   'name' => 'عرض صفحة من نحن'],
            ['slug' => 'conferences.list',             'name' => 'قائمة المؤتمرات'],
            ['slug' => 'conferences.view_details',     'name' => 'عرض تفاصيل المؤتمر'],
            ['slug' => 'conferences.view_topics',      'name' => 'عرض مواضيع المؤتمر'],
            ['slug' => 'conferences.search',           'name' => 'البحث في المؤتمرات'],
            ['slug' => 'faq.view',                     'name' => 'عرض الأسئلة الشائعة'],
            ['slug' => 'support.access',               'name' => 'الدعم الفني'],
            ['slug' => 'auth.register',                'name' => 'تسجيل حساب جديد'],
            ['slug' => 'auth.login',                   'name' => 'تسجيل الدخول'],
            ['slug' => 'auth.password_request',        'name' => 'استعادة كلمة المرور'],
            ['slug' => 'auth.logout',                  'name' => 'تسجيل الخروج'],
            ['slug' => 'profile.view',                 'name' => 'عرض الملف الشخصي'],
            ['slug' => 'profile.edit',                 'name' => 'تعديل الملف الشخصي'],
            ['slug' => 'profile.change_password',      'name' => 'تغيير كلمة المرور'],
            ['slug' => 'profile.change_avatar',        'name' => 'تغيير الصورة الشخصية'],
            ['slug' => 'settings.manage_personal',     'name' => 'إدارة الإعدادات الشخصية'],
            ['slug' => 'notifications.view',           'name' => 'عرض الإشعارات'],
            ['slug' => 'activity_log.view_personal',   'name' => 'عرض السجل الشخصي'],

            // ── الباحث ──
            ['slug' => 'paper.create',                 'name' => 'إنشاء بحث جديد'],
            ['slug' => 'paper.edit_draft',             'name' => 'تعديل مسودة البحث'],
            ['slug' => 'paper.upload_files',           'name' => 'رفع ملفات البحث'],
            ['slug' => 'paper.view_status',            'name' => 'متابعة حالة البحث'],
            ['slug' => 'paper.respond_to_reviews',     'name' => 'الرد على تقارير المحكمين'],
            ['slug' => 'paper.submit_revision',        'name' => 'رفع نسخة معدلة'],
            ['slug' => 'paper.submit_camera_ready',    'name' => 'رفع النسخة النهائية'],

            // ── المحكم ──
            ['slug' => 'review.accept_reject_assignment', 'name' => 'قبول أو رفض مهمة التحكيم'],
            ['slug' => 'review.submit',                'name' => 'تقديم تقرير التحكيم'],
            ['slug' => 'review.update',                'name' => 'تحديث تقرير التحكيم'],
            ['slug' => 'paper.view_blind_only',        'name' => 'عرض البحث بدون هوية المؤلف'],
            ['slug' => 'review.re_evaluate',           'name' => 'إعادة التقييم بعد التعديل'],

            // ── مكتب التحرير ──
            ['slug' => 'screening.initial',            'name' => 'إجراء الفحص الأولي'],
            ['slug' => 'file.validation',              'name' => 'التحقق من صيغة الملف'],
            ['slug' => 'plagiarism.check',             'name' => 'فحص نسبة الاقتباس'],
            ['slug' => 'notifications.manage',         'name' => 'إدارة الإشعارات'],
            ['slug' => 'data_entry.support',           'name' => 'دعم إدخال البيانات'],
            ['slug' => 'paper.view_all',               'name' => 'عرض جميع الأبحاث'],
            ['slug' => 'paper.contact_author',         'name' => 'التواصل مع الباحث'],

            // ── المحرر العلمي ──
            ['slug' => 'reviewer.assign',              'name' => 'تعيين المحكمين'],
            ['slug' => 'workflow.manage',              'name' => 'إدارة دورة التحكيم'],
            ['slug' => 'paper.request_revision',       'name' => 'طلب تعديل البحث'],
            ['slug' => 'decision.recommend',           'name' => 'اقتراح القرار النهائي'],
            ['slug' => 'review.monitor',               'name' => 'متابعة تقارير المحكمين'],

            // ── اللجنة العلمية ──
            ['slug' => 'reviewer.approve',             'name' => 'اعتماد اختيار المحكمين'],
            ['slug' => 'decision.approve',             'name' => 'اعتماد القرارات العلمية'],
            ['slug' => 'quality.evaluate',             'name' => 'تقييم جودة الأبحاث'],
            ['slug' => 'acceptance_threshold.define',  'name' => 'تحديد معيار القبول'],
            ['slug' => 'program.manage',               'name' => 'تنظيم البرنامج العلمي'],

            // ── رئيس المؤتمر ──
            ['slug' => 'decision.final_override',      'name' => 'القرار النهائي الأعلى'],
            ['slug' => 'acceptance_list.approve',      'name' => 'اعتماد قائمة الأبحاث المقبولة'],
            ['slug' => 'conference_structure.manage',  'name' => 'إدارة هيكل المؤتمر'],
            ['slug' => 'paper.publish',                'name' => 'نشر البحث العلمي (DOI)'],
            ['slug' => 'session.manage',               'name' => 'إدارة جلسات المؤتمر'],

            // ── مدير النظام ──
            ['slug' => 'users.manage',                 'name' => 'إدارة المستخدمين'],
            ['slug' => 'system.configure',             'name' => 'ضبط إعدادات النظام'],
            ['slug' => 'logs.view',                    'name' => 'عرض سجلات النظام'],
            ['slug' => 'security.manage',              'name' => 'إدارة الأمان'],
            ['slug' => 'backup.manage',                'name' => 'إدارة النسخ الاحتياطية'],
            ['slug' => 'roles.manage',                 'name' => 'إدارة الأدوار والصلاحيات'],
        ];

        // إنشاء / تحديث الصلاحيات
        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['slug' => $perm['slug']], ['name' => $perm['name']]);
        }

        // ─────────────────────────────────────────────
        // 2. تعريف الأدوار وصلاحياتها
        // ─────────────────────────────────────────────
        $commonPerms = [
            'home.view','about.view','conferences.list','conferences.view_details',
            'conferences.view_topics','conferences.search','faq.view','support.access',
            'auth.login','auth.logout','auth.password_request',
            'profile.view','profile.edit','profile.change_password','profile.change_avatar',
            'settings.manage_personal','notifications.view','activity_log.view_personal',
        ];

        $rolePermissions = [
            'author' => array_merge($commonPerms, [
                'auth.register',
                'paper.create',
                'paper.edit_draft',
                'paper.upload_files',
                'paper.view_status',
                'paper.respond_to_reviews',
                'paper.submit_revision',
                'paper.submit_camera_ready',
            ]),

            'reviewer' => array_merge($commonPerms, [
                'review.accept_reject_assignment',
                'review.submit',
                'review.update',
                'review.re_evaluate',
                'paper.view_blind_only',
                'paper.view_status',
            ]),

            'editorial_office' => array_merge($commonPerms, [
                'paper.view_all',
                'screening.initial',
                'file.validation',
                'plagiarism.check',
                'notifications.manage',
                'data_entry.support',
                'paper.contact_author',
            ]),

            'editor' => array_merge($commonPerms, [
                'paper.view_all',
                'reviewer.assign',
                'workflow.manage',
                'paper.request_revision',
                'decision.recommend',
                'review.monitor',
                'screening.initial',
                'notifications.manage',
            ]),

            'scientific_committee' => array_merge($commonPerms, [
                'paper.view_all',
                'reviewer.assign',
                'reviewer.approve',
                'decision.approve',
                'quality.evaluate',
                'acceptance_threshold.define',
                'program.manage',
                'session.manage',
                'paper.publish',
                'notifications.manage',
            ]),

            'conference_chair' => array_merge($commonPerms, [
                'paper.view_all',
                'decision.final_override',
                'acceptance_list.approve',
                'conference_structure.manage',
                'paper.publish',
                'session.manage',
                'program.manage',
                'notifications.manage',
                'logs.view',
            ]),

            'system_admin' => array_merge($commonPerms, [
                'paper.view_all',
                'users.manage',
                'system.configure',
                'logs.view',
                'security.manage',
                'backup.manage',
                'roles.manage',
                'notifications.manage',
            ]),
        ];

        // ─────────────────────────────────────────────
        // 3. تعيين الصلاحيات للأدوار
        // ─────────────────────────────────────────────
        foreach ($rolePermissions as $roleSlug => $permSlugs) {
            $role = Role::where('slug', $roleSlug)->first();
            if (!$role) continue;

            $permIds = Permission::whereIn('slug', $permSlugs)->pluck('id')->toArray();
            $role->permissions()->sync($permIds);

            $this->command->info("✅ {$role->name}: " . count($permIds) . " صلاحية");
        }

        $this->command->info("\n🎉 تم تعيين جميع الصلاحيات بنجاح!");
    }
}
