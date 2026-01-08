$ErrorActionPreference = "Stop"

Write-Host "🚀 Building Ticket System Microservices..." -ForegroundColor Green
Write-Host ""

# Array of services to build
$services = @(
    @{Name="Discovery Server"; Path="discovery-server"},
    @{Name="Users Service"; Path="users"},
    @{Name="Events Service"; Path="events"},
    @{Name="Sales Service"; Path="sales-service"},
    @{Name="Gateway"; Path="gateway"},
    @{Name="Notifications Service"; Path="notifications-service"}
)

foreach ($service in $services) {
    Write-Host "📦 Building $($service.Name)..." -ForegroundColor Cyan

    try {
        Push-Location $service.Path
        & .\mvnw.cmd clean package -DskipTests

        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $($service.Name) built successfully" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $($service.Name) failed to build" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "   ❌ Error building $($service.Name): $_" -ForegroundColor Red
        exit 1
    }
    finally {
        Pop-Location
    }

    Write-Host ""
}

Write-Host "🎉 All microservices built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start with Docker Compose: docker-compose up --build" -ForegroundColor White
Write-Host "2. Or start manually with: docker-compose up" -ForegroundColor White
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Yellow
Write-Host "- Eureka Dashboard: http://localhost:8761" -ForegroundColor White
Write-Host "- Users API: http://localhost:3000/api/users" -ForegroundColor White
Write-Host "- Events API: http://localhost:5001/api/events" -ForegroundColor White
Write-Host "- Sales API: http://localhost:4000/api/sales" -ForegroundColor White
Write-Host "- Gateway: http://localhost:8080" -ForegroundColor White