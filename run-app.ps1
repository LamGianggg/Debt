Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting DebtMaster - Debt & Accounts Receivable System" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Khoi chay Spring Boot 3 Backend tai cong 8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Backend'; mvn spring-boot:run"

Write-Host "Dang cho Backend khoi tao (5 giay)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "[2/2] Khoi chay React Frontend tai cong 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\Frontend'; npm run dev"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Ca 2 ung dung da duoc khoi dong!" -ForegroundColor Green
Write-Host "Frontend (Giao dien): http://localhost:5173" -ForegroundColor White
Write-Host "Backend API:          http://localhost:8080" -ForegroundColor White
Write-Host "Swagger UI:           http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
