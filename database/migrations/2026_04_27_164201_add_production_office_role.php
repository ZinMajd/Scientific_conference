<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create Role
        $roleId = DB::table('roles')->insertGetId([
            'name' => 'Production Office',
            'slug' => 'production_office',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Create Permissions
        $permissions = [
            'production.view_papers',
            'production.update_details',
            'production.schedule_publish',
            'production.publish_now',
            'production.request_revision',
        ];

        foreach ($permissions as $slug) {
            $name = ucwords(str_replace(['.', '_'], ' ', $slug));
            $permissionId = DB::table('permissions')->insertGetId([
                'name' => $name,
                'slug' => $slug,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Link Permissions to Role
            DB::table('permission_role')->insert([
                'role_id' => $roleId,
                'permission_id' => $permissionId,
            ]);
        }
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
