Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting DebtMaster - B2B Order-to-Cash & AR Automation" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Khoi chay Spring Boot 3 Backend tai cong 8080..." -ForegroundColor Green
$jarPath = Join-Path $baseDir "Backend\target\practice-backend-1.0.0.jar"
$backendDir = Join-Path $baseDir "Backend"
$frontendDir = Join-Path $baseDir "Frontend"

if (Test-Path $jarPath) {
    Start-Process powershell -WorkingDirectory $backendDir -ArgumentList "-NoExit", "-Command", "java -jar target\practice-backend-1.0.0.jar"
} else {
    Start-Process powershell -WorkingDirectory $backendDir -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"
}

Write-Host "Dang cho Backend khoi tao (3 giay)..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "[2/2] Khoi chay React Frontend tai cong 5173..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory $frontendDir -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Ca 2 ung dung da duoc khoi dong!" -ForegroundColor Green
Write-Host "Frontend (Giao dien): http://localhost:5173" -ForegroundColor White
Write-Host "Backend API:          http://localhost:8080" -ForegroundColor White
Write-Host "Swagger UI:           http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
