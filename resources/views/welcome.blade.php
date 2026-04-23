<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google" content="notranslate">
    <meta name="description" content="نظام إدارة المؤتمرات العلمية - جامعة إقليم سبأ">
    <title>نظام المؤتمرات العلمية | جامعة إقليم سبأ</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Cairo', sans-serif;
            background: #f0fafa;
            color: #003153;
            -webkit-font-smoothing: antialiased;
        }
        #app { min-height: 100vh; }
        /* Page transition */
        #app-loader {
            position: fixed; inset: 0; z-index: 9999;
            background: linear-gradient(135deg, #001a2e 0%, #003153 60%, #0096c7 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            transition: opacity 0.5s ease;
        }
        #app-loader.hidden { opacity: 0; pointer-events: none; }
        .loader-ring {
            width: 60px; height: 60px; border-radius: 50%;
            border: 4px solid transparent;
            border-top-color: #40E0D0;
            border-right-color: #40E0D0;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loader-text {
            margin-top: 20px; color: #40E0D0;
            font-size: 14px; font-weight: 700; letter-spacing: 3px;
        }
    </style>
</head>

<body>
    <!-- Loading Screen -->
    <div id="app-loader">
        <div class="loader-ring"></div>
        <p class="loader-text">جامعة إقليم سبأ</p>
    </div>

    <div id="app"></div>

    <script>
        // Hide loader once React mounts
        window.addEventListener('load', function () {
            setTimeout(function () {
                var loader = document.getElementById('app-loader');
                if (loader) loader.classList.add('hidden');
                setTimeout(function () {
                    if (loader) loader.remove();
                }, 500);
            }, 600);
        });
    </script>
</body>

</html>