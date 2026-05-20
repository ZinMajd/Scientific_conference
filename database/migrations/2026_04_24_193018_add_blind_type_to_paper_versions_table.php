<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            // Drop existing enum constraints
            DB::statement('ALTER TABLE paper_versions DROP CONSTRAINT IF EXISTS paper_versions_type_check');
            DB::statement('ALTER TABLE paper_versions DROP CONSTRAINT IF EXISTS paper_versions_type_in');
            
            // Alter column type to VARCHAR(255)
            DB::statement('ALTER TABLE paper_versions ALTER COLUMN type TYPE VARCHAR(255)');
            DB::statement("ALTER TABLE paper_versions ALTER COLUMN type SET DEFAULT 'original'");
            
            // Add the new check constraint
            DB::statement("ALTER TABLE paper_versions ADD CONSTRAINT paper_versions_type_check CHECK (type IN ('original', 'revised', 'camera_ready', 'blind'))");
        } else {
            Schema::table('paper_versions', function (Blueprint $table) {
                $table->enum('type', ['original', 'revised', 'camera_ready', 'blind'])->default('original')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE paper_versions DROP CONSTRAINT IF EXISTS paper_versions_type_check');
            DB::statement('ALTER TABLE paper_versions ALTER COLUMN type TYPE VARCHAR(255)');
            DB::statement("ALTER TABLE paper_versions ALTER COLUMN type SET DEFAULT 'original'");
            DB::statement("ALTER TABLE paper_versions ADD CONSTRAINT paper_versions_type_check CHECK (type IN ('original', 'revised', 'camera_ready'))");
        } else {
            Schema::table('paper_versions', function (Blueprint $table) {
                $table->enum('type', ['original', 'revised', 'camera_ready'])->default('original')->change();
            });
        }
    }
};
