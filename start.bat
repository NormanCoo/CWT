@echo off
chcp 65001 >nul
echo ============================================
echo   CWT - Calendar With Tasks
echo ============================================
echo.

for /f "tokens=2 delims=:()" %%a in ('ipconfig ^| findstr /C:"IPv4"') do set IP=%%a
set IP=%IP: =%

echo PC: http://localhost:3467
if not "%IP%"=="" echo Phone: http://%IP%:3467
echo.
echo (Make sure phone and PC are on the same WiFi)
echo.
echo ============================================
echo.

npm start -- -p 3467
pause
