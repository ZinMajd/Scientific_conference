<?php
$host = '127.0.0.1';
$port = 3306;
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=saba_conference_db", $user, $pass);

    $roles = $pdo->query("SELECT * FROM roles")->fetchAll(PDO::FETCH_ASSOC);
    $permissions = $pdo->query("SELECT * FROM permissions")->fetchAll(PDO::FETCH_ASSOC);
    $permission_role = $pdo->query("SELECT * FROM permission_role")->fetchAll(PDO::FETCH_ASSOC);

    $sql = "-- Roles\n";
    foreach ($roles as $r) {
        $sql .= "INSERT INTO roles (id, name, slug) VALUES ({$r['id']}, '{$r['name']}', '{$r['slug']}');\n";
    }
    $sql .= "\n-- Permissions\n";
    foreach ($permissions as $p) {
        $sql .= "INSERT INTO permissions (id, name, slug) VALUES ({$p['id']}, '" . str_replace("'", "''", $p['name']) . "', '{$p['slug']}');\n";
    }
    $sql .= "\n-- Permission-Role Mapping\n";
    foreach ($permission_role as $pr) {
        $sql .= "INSERT INTO permission_role (permission_id, role_id) VALUES ({$pr['permission_id']}, {$pr['role_id']});\n";
    }

    file_put_contents('auth_seeding.sql', $sql);
    echo "Done.\n";
} catch (PDOException $e) {
    echo $e->getMessage();
}
