<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paper;
use App\Models\PaperAssignment;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;

class ReviewTestingSeeder extends Seeder
{
    public function run(): void
    {
        $paper = Paper::find(2);
        if (!$paper) {
            $this->command->error('Paper ID 2 not found.');
            return;
        }

        $reviewer = User::where('id', '!=', $paper->author_id)->first();
        if (!$reviewer) {
            $this->command->error('No suitable reviewer user found.');
            return;
        }

        // Create assignment
        $assignment = PaperAssignment::updateOrCreate(
            ['paper_id' => $paper->id, 'reviewer_id' => $reviewer->id],
            [
                'assigned_by' => 1,
                'status' => 'completed',
                'due_date' => Carbon::now()->addDays(7)
            ]
        );

        // Create review
        Review::updateOrCreate(
            ['assignment_id' => $assignment->id],
            [
                'overall_score' => 8.5,
                'originality' => 9,
                'relevance' => 8,
                'methodology' => 8,
                'presentation' => 9,
                'technical_quality' => 8,
                'comments_author' => 'بحث ممتاز ومنظم، المنهجية العلمية واضحة والنتائج واعدة جداً. أنصح بالقبول بعد تصحيح بعض الأخطاء الإملائية البسيطة.',
                'comments_chair' => 'مراجعة دقيقة وإيجابية.',
                'decision' => 'accept',
                'confidence' => 'high',
                'is_submitted' => true,
                'submission_date' => Carbon::now()
            ]
        );

        // Update paper status to under_review so it shows up in "Reviewed Papers" 
        // as per my new logic (under_review + completed assignment)
        $paper->status = 'under_review';
        $paper->save();

        $this->command->info('Review testing data created successfully for paper: ' . $paper->title);
    }
}
