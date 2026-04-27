<?php
$content = file_get_contents('c:/System/app/Http/Controllers/Api/PaperController.php');
$content = str_replace("url('/researcher/papers/'", "url('/researcher/research/'", $content);
$content = str_replace("url('/committee/papers')", "url('/committee/research')", $content);
file_put_contents('c:/System/app/Http/Controllers/Api/PaperController.php', $content);
echo "PaperController updated.\n";
