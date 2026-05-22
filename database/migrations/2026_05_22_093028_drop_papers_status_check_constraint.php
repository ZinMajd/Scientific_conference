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
        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE papers DROP CONSTRAINT IF EXISTS papers_status_check');
        } elseif ($driver === 'sqlite') {
            // SQLite doesn't support dropping constraints easily, usually requires table recreation.
            // But if it's not breaking there, we can ignore.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No simple reverse since we moved away from ENUM check constraint
    }
};
