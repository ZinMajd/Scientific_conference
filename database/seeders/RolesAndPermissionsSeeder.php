<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('permission_user')->truncate();
        DB::table('permission_role')->truncate();
        DB::table('role_user')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Guest (Public) - These are usually handled by public routes, but we list them for completeness if needed in DB
        $guestPermissions = [
            'home.view',
            'about.view',
            'conferences.list',
            'conferences.view_details',
            'conferences.view_topics',
            'conferences.search',
            'faq.view',
            'support.access',
            'auth.register', // Researcher only
            'auth.login',
            'auth.password_request',
        ];

        // 2. Authenticated User (Common to all logged-in roles)
        $authenticatedPermissions = [
            'auth.logout',
            'profile.view',
            'profile.edit',
            'profile.change_password',
            'profile.change_avatar',
            'settings.manage_personal',
            'notifications.view',
            'activity_log.view_personal',
        ];

        // Role-Specific Permissions Matrix
        $roleMatrix = [
            'researcher' => [
                'display_name' => 'Researcher',
                'description' => 'A user who submits papers and registers for conferences.',
                'permissions' => [
                    // Conference Management
                    'conferences.view_available',
                    'conferences.register',
                    'conferences.cancel_registration',

                    // Paper Management
                    'papers.submit',
                    'papers.view_own',
                    'papers.edit',        // Before review
                    'papers.reupload',    // Validation request
                    'papers.withdraw',    // Before final acceptance
                    'papers.track_status',

                    // Interaction
                    'comments.view',

                    // Certificates
                    'certificates.download_participation',
                    'certificates.download_acceptance',
                ]
            ],
            'reviewer' => [
                'display_name' => 'Reviewer',
                'description' => 'Evaluates assigned papers.',
                'permissions' => [
                    // Assigned Papers
                    'papers.view_assigned',
                    'papers.download',

                    // Review Form
                    'reviews.fill_form',
                    'reviews.submit',
                    'reviews.decision_recommend', // Recommend Accept/Modify/Reject

                    // Management
                    'reviews.view_completed',
                    'reviews.view_history',
                    'guide.view_reviewer',

                    // Notifications
                    'notifications.assignment_receive',
                ]
            ],
            'scientific_committee' => [
                'display_name' => 'Scientific Committee',
                'description' => 'Manages scientific content and reviewers.',
                'permissions' => [
                    // Conference Management
                    'conferences.create',
                    'conferences.edit',
                    'conferences.close',

                    // Paper Management
                    'papers.view_all',
                    'papers.filter',
                    'papers.initial_decision',

                    // Reviewer Management
                    'reviewers.add',
                    'reviewers.edit',
                    'reviewers.assign',

                    // Review Results
                    'reviews.view_evaluations',
                    'reviews.recommendation', // Recommend Accept/Reject to Chair

                    // Sessions
                    'sessions.create',
                    'sessions.schedule',
                    'sessions.prepare_program',

                    // Certificates
                    'certificates.generate',
                    'certificates.approve',

                    // Reports
                    'reports.papers',
                    'reports.reviewers',
                    'reports.stats',
                ]
            ],
            'conference_chair' => [
                'display_name' => 'Conference Chair',
                'description' => 'Head of the conference with final approval power.',
                'permissions' => [
                    // Monitoring
                    'conference.monitor',
                    'kpi.view',

                    // Decisions (Approvals)
                    'decisions.approve_reviews',
                    'decisions.approve_final_papers',

                    // Sessions
                    'sessions.approve',
                    'program.approve_final',

                    // Reports
                    'reports.final',
                    'reports.general_stats',
                ]
            ],
            'editorial_office' => [
                'display_name' => 'Editorial Office',
                'description' => 'Handles initial checks and communication.',
                'permissions' => [
                    // Initial Check
                    'papers.check_compliance',
                    'papers.initial_accept_reject',

                    // Follow-up
                    'reviews.monitor_progress',
                    'communication.contact_researchers',
                    'communication.contact_reviewers',
                    'communication.manage_official',

                    // Notifications
                    'notifications.receive_all_workflow',
                ]
            ],
            'editor' => [
                'display_name' => 'Editor',
                'description' => 'Reviews language and technical aspects.',
                'permissions' => [
                    // Review
                    'papers.review_language',
                    'papers.review_technical',

                    // Modifications
                    'papers.request_revision',
                    'papers.send_to_review',
                    'papers.approve_final_version',
                ]
            ],
            'system_admin' => [
                'display_name' => 'System Administrator',
                'description' => 'Full system control.',
                'permissions' => [
                    // User Management
                    'users.create',
                    'users.edit',
                    'users.delete',
                    'users.manage_roles',

                    // Conference Management
                    'conferences.manage_all',

                    // Settings
                    'settings.general',
                    'settings.templates',
                    'settings.security',

                    // Reports
                    'reports.all',

                    // System
                    'backups.create',
                    'backups.restore',
                    'logs.view',
                ]
            ]
        ];

        // 3. Collect all unique permissions
        $allPermissions = array_unique(array_merge(
            $guestPermissions, // Optional: add guest permissions if we want them in DB
            $authenticatedPermissions,
            ...array_column($roleMatrix, 'permissions')
        ));

        // Ensure no duplicates
        $allPermissions = array_unique($allPermissions);

        // 4. Create Permissions
        $permMap = [];
        foreach ($allPermissions as $permSlug) {
            $name = ucwords(str_replace(['.', '_'], ' ', $permSlug));
            $permission = Permission::create([
                'name' => $name,
                'slug' => $permSlug,
            ]);
            $permMap[$permSlug] = $permission->id;
        }

        // 5. Create Roles and Assign Permissions
        foreach ($roleMatrix as $roleSlug => $roleData) {
            $role = Role::create([
                'name' => $roleData['display_name'],
                'slug' => $roleSlug,
                // 'description' => $roleData['description'], // Uncomment if you add description column
            ]);

            // Combine Role-Specific Permissions + Authenticated User Permissions
            // (Assuming all these roles are for authenticated users)
            $roleSpecificPerms = $roleData['permissions'];

            // Merge 'Authenticated User' permissions into this role
            // This ensures every logged-in role has the base permissions
            $finalPermissions = array_unique(array_merge($roleSpecificPerms, $authenticatedPermissions));

            $rolePermissionsIds = [];
            foreach ($finalPermissions as $permSlug) {
                if (isset($permMap[$permSlug])) {
                    $rolePermissionsIds[] = $permMap[$permSlug];
                }
            }
            $role->permissions()->attach($rolePermissionsIds);
        }
    }
}
