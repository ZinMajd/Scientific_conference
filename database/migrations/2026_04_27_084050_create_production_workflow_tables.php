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
        Schema::table('papers', function (Blueprint $table) {
            $table->timestamp('publish_at')->nullable()->after('status');
            $table->string('final_file_path')->nullable()->after('file_path');
        });

        Schema::create('production_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->string('task_type')->default('formatting'); // formatting, quality_check, final_review
            $table->enum('status', ['pending', 'processing', 'done'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained()->onDelete('cascade');
            $table->foreignId('conference_id')->constrained()->onDelete('cascade');
            $table->string('doi')->nullable();
            $table->string('page_numbers')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
        Schema::dropIfExists('production_tasks');
        Schema::table('papers', function (Blueprint $table) {
            $table->dropColumn(['publish_at', 'final_file_path']);
        });
    }
};
