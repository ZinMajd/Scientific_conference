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
        Schema::create('conflicts', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');
            $blueprint->foreignId('paper_id')->constrained()->onDelete('cascade');
            $blueprint->string('type')->default('author_conflict'); // e.g. author_conflict, colleague_conflict
            $blueprint->text('reason')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conflicts');
    }
};
