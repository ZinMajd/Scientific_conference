<?php
$content = file_get_contents('http://localhost:8000/storage_file/papers/something.pdf');
echo "Size: " . strlen($content) . "\n";
echo "First 10: " . substr($content, 0, 10) . "\n";
