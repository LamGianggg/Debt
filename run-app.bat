@echo off
title DebtMaster - He Thong Quan Ly & Thu Hoi Cong No
echo ==========================================================
echo Starting DebtMaster - B2B Order-to-Cash & AR Automation
echo ==========================================================

echo [1/2] Khoi chay Spring Boot 3 Backend tai http://localhost:8080 ...
if exist "%~dp0Backend\target\practice-backend-1.0.0.jar" (
    start "DebtMaster Backend (Spring Boot 8080)" /D "%~dp0Backend" cmd /k "java -jar target\practice-backend-1.0.0.jar"
) else (
    start "DebtMaster Backend (Spring Boot 8080)" /D "%~dp0Backend" cmd /k "mvn spring-boot:run"
)

echo Dang cho Backend khoi tao (3 giay)...
timeout /t 3 /nobreak > nul

echo [2/2] Khoi chay React Vite Frontend tai http://localhost:5173 ...
start "DebtMaster Frontend (Vite 5173)" /D "%~dp0Frontend" cmd /k "npm run dev"

echo ==========================================================
echo He thong da khoi dong xong!
echo Frontend (Giao dien): http://localhost:5173
echo Backend API:          http://localhost:8080
echo Swagger API Docs:     http://localhost:8080/swagger-ui.html
echo ==========================================================
pause
