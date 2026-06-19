<?php
$url = 'https://scientific-conference.vercel.app/storage_file/papers/test.pdf';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);
echo "Headers:\n" . $headers . "\n";
echo "Body Size: " . strlen($body) . "\n";
echo "First 50 bytes:\n" . substr($body, 0, 50) . "\n";
