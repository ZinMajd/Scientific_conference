<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('papers', function (Blueprint $table) {
            // Stage 4: Revisions
            $table->dateTime('revision_deadline')->nullable()->after('track');

            // Stage 5: Final Acceptance and Publication
            $table->boolean('publication_selected')->default(false)->after('is_published');

            // Stage 6: Classification and Presentation
            $table->enum('presentation_type', ['oral', 'poster', 'keynote', 'none'])->default('none')->after('track');
            $table->enum('participation_mode', ['physical', 'online', 'none'])->default('none')->after('presentation_type');
            $table->dateTime('invitation_sent_at')->nullable();
            $table->string('access_link', 500)->nullable();
        });

        // Update status enum - Using raw SQL for better PGSQL compatibility if needed, 
        // but since we are in Laravel, we'll try to handle it or at least define the new set.
        // For Postgres, changing enum requires custom logic, but if we use string for now it might be easier.
        DB::statement("ALTER TABLE papers ALTER COLUMN status TYPE VARCHAR(50)");
    }

    public function down(): void
    {
        Schema::table('papers', function (Blueprint $table) {
            $table->dropColumn([
                'revision_deadline',
                'publication_selected',
                'presentation_type',
                'participation_mode',
                'invitation_sent_at',
                'access_link'
            ]);
        });

        DB::statement("ALTER TABLE papers ALTER COLUMN status TYPE VARCHAR(255)");
    }
};
