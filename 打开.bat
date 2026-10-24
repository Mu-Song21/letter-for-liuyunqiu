@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在启动给刘韵秋的信...
start "" "http://127.0.0.1:8765/"
python -m http.server 8765

pause
