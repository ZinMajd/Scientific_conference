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
        // We use raw SQL because doctrine/dbal might not be installed and changing ENUMs is tricky.
        // This command modifies the column definition to include 'committee' and other roles.
        DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('admin', 'chair', 'author', 'reviewer', 'committee', 'editor', 'office') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum if needed (though usually adding values is safe to keep)
        // Check the original migration file for the initial values.
        // Assuming original was: ['admin', 'chair', 'author', 'reviewer'] or similar subset.
        // Since we don't know the exact previous state, we might skip down or revert to a safe subset if known.
        // For safety, let's keep it as is or revert to a likely previous state if crucial.
        // But since 'committee' is now required, removing it might data loss for 'committee' users.
        // So we might just leave the down method empty or comment it.
        
        // If we strictly want to reverse, we'd need to know what to reverse TO.
        // Given the error, 'committee' was missing.
        // Let's assume the previous state was without 'committee'.
        // DB::statement("ALTER TABLE users MODIFY COLUMN user_type ENUM('admin', 'chair', 'author', 'reviewer') NOT NULL");
    }
};
