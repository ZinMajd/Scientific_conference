<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Conference;
use App\Models\Paper;
use Illuminate\Support\Facades\DB;

class SamplePapersSeeder extends Seeder
{
    public function run(): void
    {
        // Find or create a sample author
        $author = User::where('user_type', 'author')->first()
            ?? User::where('email', 'sara@sabauni.edu.ye')->first()
            ?? User::first();

        if (!$author) {
            echo "No users found. Please run user seeder first.\n";
            return;
        }

        $conferences = Conference::all();

        if ($conferences->isEmpty()) {
            echo "No conferences found. Please run the main seeder first.\n";
            return;
        }

        $samplePapers = [
            [
                'title'    => 'تطبيقات الذكاء الاصطناعي في تشخيص الأمراض المزمنة',
                'abstract' => 'تستعرض هذه الورقة البحثية كيفية توظيف خوارزميات التعلم الآلي وتقنيات الذكاء الاصطناعي في تشخيص الأمراض المزمنة مبكراً، مع عرض لتجارب عملية على مجموعات بيانات حقيقية.',
                'keywords' => 'ذكاء اصطناعي, تشخيص طبي, تعلم آلي, أمراض مزمنة',
                'track'    => 'علوم الحاسوب',
            ],
            [
                'title'    => 'أثر الرقمنة في تطوير المنظومة التعليمية باليمن',
                'abstract' => 'تتناول هذه الدراسة التحديات والفرص المرتبطة بالتحول الرقمي في القطاع التعليمي اليمني، وتقترح نماذج عملية قابلة للتطبيق في بيئات محدودة الموارد.',
                'keywords' => 'تعليم رقمي, يمن, تكنولوجيا تعليم, رقمنة',
                'track'    => 'العلوم الاجتماعية',
            ],
            [
                'title'    => 'نحو بنية تحتية رقمية مستدامة: دراسة حالة جامعة إقليم سبأ',
                'abstract' => 'يقدم هذا البحث تحليلاً تفصيلياً لمشروع التحول الرقمي في جامعة إقليم سبأ، ويستعرض النتائج والتوصيات المستخلصة من التجربة الميدانية.',
                'keywords' => 'بنية تحتية, جامعة, رقمنة, استدامة',
                'track'    => 'الهندسة',
            ],
            [
                'title'    => 'معالجة اللغة العربية الطبيعية: التحديات والحلول',
                'abstract' => 'تستعرض الورقة أبرز التحديات التقنية في معالجة اللغة العربية الطبيعية، وتعرض حلولاً مبتكرة مبنية على نماذج اللغة الكبيرة المدربة على البيانات العربية.',
                'keywords' => 'معالجة لغة طبيعية, عربية, نماذج لغوية',
                'track'    => 'اللغة العربية',
            ],
            [
                'title'    => 'الأمن السيبراني في المؤسسات الأكاديمية: إطار عمل مقترح',
                'abstract' => 'تقترح هذه الورقة إطار عمل شاملاً للأمن السيبراني مصمماً خصيصاً للمؤسسات الأكاديمية في الدول النامية، مع مراعاة محدودية الموارد والكفاءات التقنية.',
                'keywords' => 'أمن سيبراني, مؤسسات أكاديمية, حماية بيانات',
                'track'    => 'علوم الحاسوب',
            ],
        ];

        foreach ($conferences as $conference) {
            $inserted = 0;
            foreach ($samplePapers as $paperData) {
                // Avoid duplicate titles per conference
                $exists = Paper::where('conf_id', $conference->id)
                    ->where('title', $paperData['title'])
                    ->exists();

                if (!$exists) {
                    Paper::create([
                        'author_id'      => $author->id,
                        'conf_id'        => $conference->id,
                        'title'          => $paperData['title'],
                        'abstract'       => $paperData['abstract'],
                        'keywords'       => $paperData['keywords'],
                        'track'          => $paperData['track'],
                        'status'         => 'published',
                        'is_published'   => true,
                        'final_decision' => 'accepted',
                        'file_path'      => 'papers/sample/sample_paper.pdf',
                        'file_name'      => 'sample_paper.pdf',
                    ]);
                    $inserted++;
                }
            }
            echo "Conference [{$conference->title}]: inserted {$inserted} papers.\n";
        }
    }
}
