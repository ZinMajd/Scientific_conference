<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chair_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 200);
            $table->text('description');
            $table->string('short_name', 50)->nullable();
            $table->string('venue', 200);
            $table->date('start_date');
            $table->date('end_date');
            $table->dateTime('submission_deadline');
            $table->dateTime('review_deadline');
            $table->dateTime('notification_date');
            $table->dateTime('camera_ready_deadline')->nullable();
            $table->dateTime('registration_deadline')->nullable();
            $table->decimal('registration_fee', 10, 2)->default(0.00);
            $table->integer('max_papers')->nullable();
            $table->enum('status', ['draft', 'open', 'reviewing', 'closed', 'archived'])->default('draft');
            $table->string('website_url')->nullable();
            $table->string('contact_email', 100)->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('submission_deadline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conferences');
    }
};
