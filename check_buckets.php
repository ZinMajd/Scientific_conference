<?php
$supabaseUrl = 'https://ygjjurnheomesuyvgoie.supabase.co';
$anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnamp1cm5oZW9tZXN1eXZnb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzUwNzcsImV4cCI6MjA4NzgxMTA3N30.gMRy56jfQ5jAUfCXTmRsr2R6IMFfnYsLbBqbAUS0x00'; // truncated? Wait, from .env: 
// VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnamp1cm5oZW9tZXN1eXZnb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzUwNzcsImV4cCI6MjA4NzgxMTA3N30.gMRy56jfQ5jAUfCXTmRsr2R6IMFfnYsLbBqbAUS0x00
$anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnamp1cm5oZW9tZXN1eXZnb2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzUwNzcsImV4cCI6MjA4NzgxMTA3N30.gMRy56jfQ5jAUfCXTmRsr2R6IMFfnYsLbBqbAUS0x00';

$ch = curl_init($supabaseUrl . '/storage/v1/bucket');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $anonKey",
    "Authorization: Bearer $anonKey"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo "Buckets: " . $response . "\n";
