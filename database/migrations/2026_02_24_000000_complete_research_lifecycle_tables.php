<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. Update Users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'cv_path')) {
                $table->string('cv_path')->nullable()->after('bio');
            }
        });

        // 2. Update Papers table
        Schema::table('papers', function (Blueprint $table) {
            if (!Schema::hasColumn('papers', 'tracking_number')) {
                $table->string('tracking_number', 50)->nullable()->unique()->after('id');
            }
        });

        // 3. Create initial_screenings table (Stage 2)
        Schema::create('initial_screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->foreignId('screener_id')->constrained('users')->onDelete('cascade');
            $table->decimal('plagiarism_score', 5, 2)->nullable();
            $table->boolean('format_check_passed')->default(true);
            $table->boolean('completeness_check_passed')->default(true);
            $table->enum('result', ['pass', 'fail', 'revision_required']);
            $table->text('comments')->nullable();
            $table->timestamps();
        });

        // 4. Create paper_versions table (Stage 1, 5, 6)
        Schema::create('paper_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->integer('version_number')->default(1);
            $table->string('file_path');
            $table->string('response_letter_path')->nullable();
            $table->text('author_comments')->nullable();
            $table->enum('type', ['original', 'revised', 'camera_ready'])->default('original');
            $table->timestamps();
        });

        // 5. Create certificates table (Stage 10)
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('conf_id')->constrained('conferences')->onDelete('cascade');
            $table->foreignId('paper_id')->nullable()->constrained('papers')->onDelete('set null');
            $table->enum('type', ['participation', 'presentation', 'review', 'organizing']);
            $table->string('file_path')->nullable();
            $table->timestamps();
        });

        // 6. Create conference_settings (Stage 0)
        Schema::create('conference_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conf_id')->constrained('conferences')->onDelete('cascade');
            $table->string('key');
            $table->text('value')->nullable();
            $table->timestamps();

            $table->unique(['conf_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conference_settings');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('paper_versions');
        Schema::dropIfExists('initial_screenings');
        
        Schema::table('papers', function (Blueprint $table) {
            $table->dropColumn('tracking_number');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('cv_path');
        });
    }
};
