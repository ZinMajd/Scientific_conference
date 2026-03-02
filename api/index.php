<?php

// Fix for Vercel: Prevent Laravel from stripping the '/api' prefix
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

// Forward Vercel requests to normal index.php
require __DIR__ . '/../public/index.php';
