<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conference;

class ConferenceImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path prefix based on Route::get('/storage_file/{path}', ...) in web.php
        $images = [
            'SabaAI-2026' => '/storage_file/conferences/saba_ai_2026.png',
            'YE-Energy' => '/storage_file/conferences/ye_energy_2026.png',
            'CyberSec-2026' => '/storage_file/conferences/cybersec_2026.png',
            'AI-Systems-2026' => '/storage_file/conferences/ai_systems_2026.png',
            'Mobile-IoT-2026' => '/storage_file/conferences/mobile_iot_2026.png',
            'Cloud-Net-2026' => '/storage_file/conferences/cloud_net_2026.png',
            'InfoSec-Tech-2026' => '/storage_file/conferences/cybersec_2026.png', // Reuse one due to quota
        ];

        foreach ($images as $shortName => $imageUrl) {
            Conference::where('short_name', $shortName)->update(['image_url' => $imageUrl]);
        }
    }
}
