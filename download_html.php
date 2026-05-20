<?php
$html = file_get_contents('https://ojs.ukscip.com/index.php/dtra/about/editorialTeam');
file_put_contents('ojs_page.html', $html);
