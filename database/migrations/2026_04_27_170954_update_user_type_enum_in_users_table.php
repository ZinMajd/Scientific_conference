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
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            // Drop existing enum constraints
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check');
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_in');
            
            // Alter column type to VARCHAR(255)
            DB::statement('ALTER TABLE users ALTER COLUMN user_type TYPE VARCHAR(255)');
            
            // Add the new check constraint
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('admin', 'chair', 'author', 'reviewer', 'committee', 'editor', 'office', 'production_office'))");
        } else {
            DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('admin', 'chair', 'author', 'reviewer', 'committee', 'editor', 'office', 'production_office') NOT NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_user_type_check');
            DB::statement('ALTER TABLE users ALTER COLUMN user_type TYPE VARCHAR(255)');
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_user_type_check CHECK (user_type IN ('admin', 'chair', 'author', 'reviewer', 'committee', 'editor', 'office'))");
        } else {
            DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('admin', 'chair', 'author', 'reviewer', 'committee', 'editor', 'office') NOT NULL");
        }
    }
};
