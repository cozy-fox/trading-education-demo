# Trading Education Platform - Installation Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Trading Education Platform - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "OK Node.js: $nodeVersion" -ForegroundColor Green

# Install root dependencies
Write-Host ""
Write-Host "1. Installing root dependencies..." -ForegroundColor Cyan
npm install

# Install frontend dependencies
Write-Host ""
Write-Host "2. Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies
Write-Host ""
Write-Host "3. Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..

# Setup environment files
Write-Host ""
Write-Host "4. Setting up environment files..." -ForegroundColor Cyan

if (Test-Path "backend\.env") {
    Write-Host "OK backend/.env exists" -ForegroundColor Green
} elseif (Test-Path "backend\.env.example") {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "OK Created backend/.env" -ForegroundColor Green
}

if (Test-Path "frontend\.env.local") {
    Write-Host "OK frontend/.env.local exists" -ForegroundColor Green
} elseif (Test-Path "frontend\.env.example") {
    Copy-Item "frontend\.env.example" "frontend\.env.local"
    Write-Host "OK Created frontend/.env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Edit backend/.env with your MongoDB URI" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the application" -ForegroundColor White
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

