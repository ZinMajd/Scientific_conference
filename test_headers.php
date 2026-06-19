<?php
$url = 'http://localhost:8000/storage_file/papers/test.pdf';
$headers = get_headers($url, 1);
print_r($headers);
