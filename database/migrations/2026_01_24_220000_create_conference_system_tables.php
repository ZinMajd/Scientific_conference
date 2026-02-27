<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Topics
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->text('description')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('topics')->onDelete('set null');
            $table->timestamps();
        });

        // Papers
        Schema::create('papers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('conf_id')->constrained('conferences')->onDelete('cascade');
            $table->string('title', 300);
            $table->text('abstract');
            $table->string('keywords', 500);
            $table->string('file_path', 500);
            $table->string('file_name', 255);
            $table->integer('file_size');
            $table->string('file_type', 50);
            $table->enum('status', ['submitted', 'under_review', 'accepted', 'rejected', 'revision_requested', 'withdrawn'])->default('submitted');
            $table->string('track', 100)->nullable();
            $table->dateTime('decision_date')->nullable();
            $table->enum('final_decision', ['accept', 'reject'])->nullable();
            $table->text('decision_notes')->nullable();
            $table->boolean('is_published')->default(false);
            $table->string('doi', 100)->nullable()->unique();
            $table->string('page_numbers', 20)->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });

        // Coauthors
        Schema::create('coauthors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->string('full_name', 100);
            $table->string('email', 100);
            $table->string('affiliation', 200)->nullable();
            $table->string('country', 100)->nullable();
            $table->integer('author_order')->default(1);
            $table->timestamps();

            $table->unique(['paper_id', 'author_order']);
        });

        // Paper Topics
        Schema::create('paper_topics', function (Blueprint $table) {
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            $table->boolean('is_primary')->default(false);
            $table->primary(['paper_id', 'topic_id']);
        });

        // Reviewer Expertise
        Schema::create('reviewer_expertise', function (Blueprint $table) {
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('topic_id')->constrained('topics')->onDelete('cascade');
            $table->enum('proficiency_level', ['beginner', 'intermediate', 'expert'])->default('intermediate');
            $table->primary(['reviewer_id', 'topic_id']);
        });

        // Paper Assignments
        Schema::create('paper_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->dateTime('due_date')->nullable();
            $table->enum('status', ['assigned', 'accepted', 'declined', 'completed'])->default('assigned');
            $table->text('decline_reason')->nullable();
            $table->timestamps();

            $table->unique(['paper_id', 'reviewer_id']);
            $table->index('status');
        });

        // Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('paper_assignments')->onDelete('cascade');
            $table->decimal('overall_score', 3, 2)->nullable();
            $table->integer('originality')->nullable();
            $table->integer('relevance')->nullable();
            $table->integer('methodology')->nullable();
            $table->integer('presentation')->nullable();
            $table->integer('technical_quality')->nullable();
            $table->text('comments_author')->nullable();
            $table->text('comments_chair')->nullable();
            $table->enum('decision', ['accept', 'minor_revision', 'major_revision', 'reject'])->nullable();
            $table->enum('confidence', ['high', 'medium', 'low'])->default('medium');
            $table->boolean('is_submitted')->default(false);
            $table->dateTime('submission_date')->nullable();
            $table->timestamps();

            $table->index('decision');
        });

        // Scientific Sessions
        Schema::create('scientific_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conf_id')->constrained('conferences')->onDelete('cascade');
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('session_type', ['oral', 'poster', 'keynote', 'workshop'])->default('oral');
            $table->foreignId('chair_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('room', 100)->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->integer('max_attendees')->nullable();
            $table->timestamps();
        });

        // Session Papers
        Schema::create('session_papers', function (Blueprint $table) {
            $table->foreignId('session_id')->constrained('scientific_sessions')->onDelete('cascade');
            $table->foreignId('paper_id')->constrained('papers')->onDelete('cascade');
            $table->integer('presentation_order');
            $table->dateTime('presentation_time')->nullable();
            $table->integer('duration_minutes')->default(15);
            $table->primary(['session_id', 'paper_id']);
        });

        // Attendees
        Schema::create('attendees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('conf_id')->constrained('conferences')->onDelete('cascade');
            $table->string('full_name', 100);
            $table->string('email', 100);
            $table->string('affiliation', 200)->nullable();
            $table->enum('registration_type', ['author', 'reviewer', 'participant', 'student', 'guest']);
            $table->enum('payment_status', ['pending', 'paid', 'waived', 'cancelled'])->default('pending');
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->string('receipt_number', 50)->nullable();
            $table->boolean('has_certificate')->default(false);
            $table->dateTime('certificate_sent_date')->nullable();
            $table->timestamps();

            $table->unique(['conf_id', 'email']);
            $table->index('payment_status');
        });

        // Notifications
        Schema::create('notifications_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 200);
            $table->text('message');
            $table->enum('notification_type', ['system', 'conference', 'paper', 'review']);
            $table->integer('related_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->dateTime('read_at')->nullable();
            $table->timestamps();
        });

        // Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action', 100);
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('notifications_log');
        Schema::dropIfExists('attendees');
        Schema::dropIfExists('session_papers');
        Schema::dropIfExists('scientific_sessions');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('paper_assignments');
        Schema::dropIfExists('reviewer_expertise');
        Schema::dropIfExists('paper_topics');
        Schema::dropIfExists('coauthors');
        Schema::dropIfExists('papers');
        Schema::dropIfExists('topics');
    }
};
