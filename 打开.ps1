Set-Location $PSScriptRoot
Start-Process "http://127.0.0.1:8765/"
Write-Host "已打开浏览器。不要关闭这个窗口，关掉就等于停止服务。" -ForegroundColor Cyan
python -m http.server 8765
