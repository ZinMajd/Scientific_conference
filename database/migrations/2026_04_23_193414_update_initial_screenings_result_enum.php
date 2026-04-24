<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // On MySQL, we need to use a raw query to change ENUM values if not using 'doctrine/dbal'
        // or just change it to string for better flexibility in international workflows
        Schema::table('initial_screenings', function (Blueprint $table) {
            $table->string('result', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('initial_screenings', function (Blueprint $table) {
            $table->enum('result', ['pass', 'fail', 'revision_required'])->change();
        });
    }
};
