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
            if (!Schema::hasColumn('papers', 'revision_deadline')) {
                $table->dateTime('revision_deadline')->nullable()->after('track');
            }

            // Stage 5: Final Acceptance and Publication
            if (!Schema::hasColumn('papers', 'publication_selected')) {
                $table->boolean('publication_selected')->default(false)->after('is_published');
            }

            // Stage 6: Classification and Presentation
            if (!Schema::hasColumn('papers', 'presentation_type')) {
                $table->enum('presentation_type', ['oral', 'poster', 'keynote', 'none'])->default('none')->after('track');
            }
            if (!Schema::hasColumn('papers', 'participation_mode')) {
                $table->enum('participation_mode', ['physical', 'online', 'none'])->default('none')->after('presentation_type');
            }
            if (!Schema::hasColumn('papers', 'invitation_sent_at')) {
                $table->dateTime('invitation_sent_at')->nullable();
            }
            if (!Schema::hasColumn('papers', 'access_link')) {
                $table->string('access_link', 500)->nullable();
            }
        });

        // Update status enum - Using compatible syntax for MySQL
        DB::statement("ALTER TABLE papers MODIFY COLUMN status VARCHAR(50)");
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

        DB::statement("ALTER TABLE papers MODIFY COLUMN status VARCHAR(255)");
    }
};
