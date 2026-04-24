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
        Schema::create('screening_decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper_id')->constrained()->onDelete('cascade');
            $table->string('system_recommendation'); // e.g. ACCEPT_PRELIMINARY, REJECT, REVISION_REQUIRED
            $table->string('editor_decision')->nullable(); // Final decision by editor
            $table->text('notes')->nullable();
            $table->foreignId('decided_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_decisions');
    }
};
