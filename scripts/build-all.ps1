# VibeCoding Build All Services Script
# This script builds the main project and all vibe-services

Write-Host "🚀 Building VibeCoding System..." -ForegroundColor Cyan

# Phase 1: Install dependencies for all services
# This is still necessary as each service has its own package.json for runtime dependencies
Write-Host "`n📦 Installing dependencies for all services..." -ForegroundColor Cyan
$services = @(
    "context-manager",
    "code-generator", 
    "dependency-tracker",
    "doc-generator",
    "test-validator",
    "deployment-manager"
)
foreach ($service in $services) {
    Write-Host "  Installing $service dependencies..." -ForegroundColor DarkYellow
    Push-Location "vibe-services/$service"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ $service dependencies installation failed! Continuing anyway." -ForegroundColor Red
    }
    Pop-Location
}
Write-Host "✅ All service dependencies processed." -ForegroundColor Green


# --- Phase 2: Build everything from the root ---
Write-Host "`n🚀 Starting unified compilation..." -ForegroundColor Cyan

# Build main project and all services
Write-Host "`n📦 Building main project and all services..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Unified build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Unified build completed successfully" -ForegroundColor Green

Write-Host "`n🎉 VibeCoding System build completed!" -ForegroundColor Cyan
Write-Host "💡 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test CLI: npm run vibecoding" -ForegroundColor White  
Write-Host "  2. Initialize project: npm run vibecoding init" -ForegroundColor White
Write-Host "  3. Start system: npm start" -ForegroundColor White 