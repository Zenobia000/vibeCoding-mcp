# VibeCoding Build All Services Script
# This script builds the main project and all vibe-services

Write-Host "🚀 Building VibeCoding System..." -ForegroundColor Cyan

# Build main project
Write-Host "`n📦 Building main project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Main project build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Main project built successfully" -ForegroundColor Green

# Build all vibe-services
$services = @(
    "context-manager",
    "code-generator", 
    "dependency-tracker",
    "doc-generator",
    "test-validator",
    "deployment-manager"
)

foreach ($service in $services) {
    Write-Host "`n📦 Building $service..." -ForegroundColor Yellow
    
    Push-Location "vibe-services/$service"
    
    # Build the service
    npm run build
    $buildResult = $LASTEXITCODE
    
    Pop-Location
    
    if ($buildResult -eq 0) {
        Write-Host "✅ $service built successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $service build had issues (but continuing...)" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 VibeCoding System build completed!" -ForegroundColor Cyan
Write-Host "📋 Summary:" -ForegroundColor White
Write-Host "  - Main project: ✅ Built" -ForegroundColor Green
Write-Host "  - Services: $($services.Count) services processed" -ForegroundColor Green
Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test CLI: npm run vibecoding" -ForegroundColor White  
Write-Host "  2. Initialize project: npm run vibecoding init" -ForegroundColor White
Write-Host "  3. Start system: npm start" -ForegroundColor White 