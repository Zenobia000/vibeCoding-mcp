#!/usr/bin/env pwsh

Write-Host "🔍 VibeCoding Template - Structure Verification" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$issues = @()

# Check if each vibe-service has exactly 3 files
Write-Host "`n📁 Checking vibe-services structure..." -ForegroundColor Yellow

$services = @("context-manager", "code-generator", "dependency-tracker", "test-validator", "doc-generator", "deployment-manager")

foreach ($service in $services) {
    $servicePath = "vibe-services\$service"
    if (Test-Path $servicePath) {
        $files = Get-ChildItem -Path $servicePath -File
        if ($files.Count -eq 3) {
            $requiredFiles = @("index.ts", "package.json", "tsconfig.json")
            $actualFiles = $files.Name | Sort-Object
            $expectedFiles = $requiredFiles | Sort-Object
            
            if (Compare-Object $actualFiles $expectedFiles) {
                $issues += "❌ $service has incorrect files: $($files.Name -join ', ')"
            } else {
                Write-Host "  ✅ $service - Correct structure" -ForegroundColor Green
            }
        } else {
            $issues += "❌ $service has $($files.Count) files instead of 3"
        }
    } else {
        $issues += "❌ Missing service: $service"
    }
}

# Check for duplicate node_modules
Write-Host "`n📦 Checking for duplicate node_modules..." -ForegroundColor Yellow
$nodeModules = Get-ChildItem -Path "vibe-services" -Recurse -Directory -Name "node_modules" 2>$null
if ($nodeModules.Count -gt 0) {
    $issues += "❌ Found $($nodeModules.Count) duplicate node_modules in vibe-services"
} else {
    Write-Host "  ✅ No duplicate node_modules found" -ForegroundColor Green
}

# Check for duplicate package-lock.json
Write-Host "`n🔒 Checking for duplicate package-lock.json..." -ForegroundColor Yellow
$packageLocks = Get-ChildItem -Path "vibe-services" -Recurse -Name "package-lock.json" 2>$null
if ($packageLocks.Count -gt 0) {
    $issues += "❌ Found $($packageLocks.Count) duplicate package-lock.json in vibe-services"
} else {
    Write-Host "  ✅ No duplicate package-lock.json found" -ForegroundColor Green
}

# Check for TypeScript map files
Write-Host "`n🗺️ Checking for unnecessary .d.ts.map files..." -ForegroundColor Yellow
$mapFiles = Get-ChildItem -Recurse -Filter "*.d.ts.map" 2>$null
if ($mapFiles.Count -gt 0) {
    $issues += "❌ Found $($mapFiles.Count) unnecessary .d.ts.map files"
} else {
    Write-Host "  ✅ No unnecessary .d.ts.map files found" -ForegroundColor Green
}

# Check essential directories exist
Write-Host "`n📂 Checking essential directories..." -ForegroundColor Yellow
$essentialDirs = @(
    "src", "dist", "vibe-services", ".vibecoding",
    "0_discovery", "1_design", "2_implementation", "3_validation", "4_deployment",
    "design_templates", "knowledge-base", "scripts"
)

foreach ($dir in $essentialDirs) {
    if (Test-Path $dir) {
        Write-Host "  ✅ $dir exists" -ForegroundColor Green
    } else {
        $issues += "❌ Missing essential directory: $dir"
    }
}

# Check essential files exist
Write-Host "`n📄 Checking essential files..." -ForegroundColor Yellow
$essentialFiles = @(
    "package.json", "tsconfig.json", ".gitignore", "README.md", 
    "QUICK_START.md", "LICENSE", ".cursorrules"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file exists" -ForegroundColor Green
    } else {
        $issues += "❌ Missing essential file: $file"
    }
}

# Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($issues.Count -eq 0) {
    Write-Host "🎉 PROJECT STRUCTURE VERIFICATION PASSED!" -ForegroundColor Green
    Write-Host "   All checks completed successfully." -ForegroundColor Green
    Write-Host "   The project structure is clean and properly organized." -ForegroundColor Green
} else {
    Write-Host "⚠️  PROJECT STRUCTURE ISSUES FOUND:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "   $issue" -ForegroundColor Red
    }
    Write-Host "`n   Please fix these issues to maintain project integrity." -ForegroundColor Yellow
}
Write-Host "="*50 -ForegroundColor Cyan

# Return exit code
if ($issues.Count -eq 0) { exit 0 } else { exit 1 } 