@echo off
cd /d "%~dp0"
echo ===== Leave Management System =====
echo Make sure MySQL is running (XAMPP Control Panel - MySQL - Start)
if not exist node_modules (
  echo Installing packages, please wait...
  call npm install
)
echo Starting server...
call npm start
pause
