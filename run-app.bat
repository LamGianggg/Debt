@echo off
title DebtMaster - He Thong Quan Ly & Thu Hoi Cong No
echo ==========================================================
echo Starting DebtMaster - Debt & Accounts Receivable System
echo ==========================================================

echo [1/2] Khoi chay Spring Boot 3 Backend tai http://localhost:8080 ...
start "DebtMaster Backend (Spring Boot 8080)" cmd /k "cd /d %~dp0Backend && mvn spring-boot:run"

echo Dang cho Backend khoi tao (5 giay)...
timeout /t 5 /nobreak > nul

echo [2/2] Khoi chay React Vite Frontend tai http://localhost:5173 ...
start "DebtMaster Frontend (Vite 5173)" cmd /k "cd /d %~dp0Frontend && npm run dev"

echo ==========================================================
echo He thong da khoi dong xong!
echo Frontend (Giao dien): http://localhost:5173
echo Backend API: http://localhost:8080
echo Swagger API Docs: http://localhost:8080/swagger-ui.html
echo ==========================================================
pause
