@echo off
start "Exam Server" /min node "%~dp0server.js"
timeout /t 2 >nul
start "" http://127.0.0.1:4173
