$ErrorActionPreference = "Stop"

# Check for Administrator privileges
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "[-] NOT RUNNING AS ADMINISTRATOR!"
    Write-Warning "Please right-click PowerShell and select 'Run as Administrator', then run this script again."
    Read-Host "Press Enter to exit..."
    exit 1
}

# Paths identified from system
$mysqldPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$defaultsFile = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$initFile = "$PSScriptRoot\mysql-init.txt"

# Verify paths
if (-not (Test-Path $mysqldPath)) {
    Write-Error "Could not find mysqld.exe at $mysqldPath"
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "1. Stopping MySQL80 Service..."
Stop-Service MySQL80 -Force

Write-Host "2. Creating init file to reset password..."
# MySQL 8.0 syntax to reset password
Set-Content -Path $initFile -Value "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';`nFLUSH PRIVILEGES;`nSHUTDOWN;"

Write-Host "3. Applying password reset..."
$proc = Start-Process -FilePath $mysqldPath -ArgumentList "--defaults-file=""$defaultsFile""", "--init-file=""$initFile""", "--console" -PassThru -NoNewWindow

# Wait for it to exit
$proc | Wait-Process -Timeout 45 -ErrorAction SilentlyContinue

if (-not $proc.HasExited) {
    Write-Host "Process didn't exit automatically. Killing..."
    $proc | Stop-Process -Force
}

Write-Host "4. Cleaning up..."
Remove-Item $initFile -Force -ErrorAction SilentlyContinue

Write-Host "5. Restarting MySQL80 Service..."
Start-Service MySQL80

Write-Host "[+] SUCCESS: Password for 'root' has been reset to 'root'."
Write-Host "You can now return to the chat."
Read-Host "Press Enter to close..."
