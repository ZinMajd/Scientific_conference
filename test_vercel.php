<?php
$url = 'https://scientific-conference.vercel.app/storage_file/papers/test.pdf';
$headers = @get_headers($url, 1);
if ($headers) {
    print_r($headers);
} else {
    echo "Failed to get headers.";
}
