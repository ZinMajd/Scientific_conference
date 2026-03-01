<?php
$ini_file = php_ini_loaded_file();
if ($ini_file) {
    echo "Loaded php.ini: " . $ini_file . "\n";
    $content = file_get_contents($ini_file);
    if ($content !== false) {
        $content = str_replace(';extension=pdo_pgsql', 'extension=pdo_pgsql', $content);
        $content = str_replace(';extension=pgsql', 'extension=pgsql', $content);
        if (file_put_contents($ini_file, $content) !== false) {
            echo "Successfully enabled pgsql and pdo_pgsql extensions.\n";
        } else {
            echo "Failed to write to php.ini.\n";
        }
    } else {
        echo "Failed to read php.ini.\n";
    }
} else {
    echo "No php.ini loaded.\n";
}
