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
        Schema::create('paper_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assignment_id')->constrained('paper_assignments')->onDelete('cascade');
            
            // Quantitative Scores (1-10)
            $table->integer('originality_score')->default(0);
            $table->integer('methodology_score')->default(0);
            $table->integer('results_score')->default(0);
            $table->integer('clarity_score')->default(0);
            $table->decimal('total_avg_score', 5, 2)->default(0);
            
            // Qualitative Feedback
            $table->text('comments_to_author')->nullable();
            $table->text('comments_to_editor')->nullable();
            
            // Final Recommendation
            $table->enum('recommendation', [
                'accept', 
                'minor_revision', 
                'major_revision', 
                'reject'
            ])->default('accept');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_reviews');
    }
};
