<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Paper;
use App\Services\PaperWorkflowService;
use Illuminate\Support\Facades\DB;

class AutoPublishPapers extends Command
{
    protected $signature = 'papers:auto-publish';
    protected $description = 'Automatically publish papers that are ready and reached their publish_at date';

    public function handle(PaperWorkflowService $workflow)
    {
        $this->info('Checking for papers to publish...');

        $papers = Paper::where('status', Paper::STATUS_READY_TO_PUBLISH)
            ->where('publish_at', '<=', now())
            ->get();

        if ($papers->isEmpty()) {
            $this->info('No papers found for publishing.');
            return;
        }

        foreach ($papers as $paper) {
            $this->info("Publishing paper: {$paper->title}");

            DB::transaction(function () use ($paper, $workflow) {
                $workflow->transition($paper, 'PUBLISH', 'نشر تلقائي بعد انتهاء فترة الانتظار في طابور الإنتاج.');
                
                $paper->is_published = true;
                $paper->save();

                // Create Publication record if not exists
                DB::table('publications')->updateOrInsert(
                    ['paper_id' => $paper->id],
                    [
                        'conference_id' => $paper->conf_id,
                        'doi' => $paper->doi,
                        'page_numbers' => $paper->page_numbers,
                        'file_path' => $paper->final_file_path ?? $paper->file_path,
                        'published_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            });

            $this->info("Paper {$paper->id} published successfully.");
        }

        $this->info('Auto-publishing completed.');
    }
}
