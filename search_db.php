<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$tables = DB::select('SHOW TABLES');
$dbName = 'Tables_in_' . env('DB_DATABASE', 'scientific_conference');
if (!isset($tables[0]->$dbName)) {
    $dbName = array_keys((array)$tables[0])[0];
}

$search = '%Reviewer assigned:%';

foreach ($tables as $tableInfo) {
    $table = $tableInfo->$dbName;
    $columns = Schema::getColumnListing($table);
    
    foreach ($columns as $column) {
        // Only search string-like columns
        $type = Schema::getColumnType($table, $column);
        if (in_array($type, ['string', 'text', 'longtext', 'mediumtext'])) {
            try {
                $results = DB::table($table)->where($column, 'LIKE', $search)->limit(1)->get();
                if ($results->count() > 0) {
                    echo "Found in Table: {$table}, Column: {$column}\n";
                }
            } catch (\Exception $e) {
                // Ignore json columns or others that can't be queried with LIKE
            }
        }
    }
}
echo "Done.\n";
