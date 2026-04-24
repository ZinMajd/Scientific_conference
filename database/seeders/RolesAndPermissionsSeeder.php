<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('permission_user')->truncate();
        DB::table('permission_role')->truncate();
        DB::table('role_user')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        Schema::enableForeignKeyConstraints();

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

        // Role-Specific Permissions Matrix based on user requirements
        $roleMatrix = [
            'author' => [
                'display_name' => 'Author (Researcher)',
                'description' => 'Submits papers and manages revisions.',
                'permissions' => [
                    'paper.create',
                    'paper.edit_draft',
                    'paper.upload_files',
                    'paper.view_status',
                    'paper.respond_to_reviews',
                ]
            ],
            'reviewer' => [
                'display_name' => 'Reviewer',
                'description' => 'Evaluates assigned blind papers.',
                'permissions' => [
                    'review.accept_reject_assignment',
                    'review.submit',
                    'review.update',
                    'paper.view_blind_only',
                ]
            ],
            'editor' => [
                'display_name' => 'Editor',
                'description' => 'Manages workflow and reviewer assignments.',
                'permissions' => [
                    'reviewer.assign',
                    'workflow.manage',
                    'paper.view_all',
                    'paper.request_revision',
                    'decision.recommend',
                ]
            ],
            'editorial_office' => [
                'display_name' => 'Editorial Office',
                'description' => 'Handles initial screening and validation.',
                'permissions' => [
                    'screening.initial',
                    'file.validation',
                    'plagiarism.check',
                    'notifications.manage',
                    'data_entry.support',
                ]
            ],
            'scientific_committee' => [
                'display_name' => 'Scientific Committee',
                'description' => 'Quality control and approval.',
                'permissions' => [
                    'reviewer.approve',
                    'decision.approve',
                    'quality.evaluate',
                    'acceptance_threshold.define',
                ]
            ],
            'conference_chair' => [
                'display_name' => 'Conference Chair',
                'description' => 'Final authority on conference decisions.',
                'permissions' => [
                    'decision.final_override',
                    'acceptance_list.approve',
                    'conference_structure.manage',
                ]
            ],
            'system_admin' => [
                'display_name' => 'System Administrator',
                'description' => 'Full system maintenance.',
                'permissions' => [
                    'users.manage',
                    'system.configure',
                    'logs.view',
                    'security.manage',
                    'backup.manage',
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
