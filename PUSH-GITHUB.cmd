@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0PUSH-GITHUB.ps1"
exit /b %errorlevel%
