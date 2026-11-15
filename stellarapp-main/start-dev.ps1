# NASA Space Apps Challenge 2026 - StellarApp
# Script de inicio rápido para Backend (FastAPI) y Frontend (Next.js)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Iniciando StellarApp: Microgravity Fire Intelligence" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Iniciar Backend en segundo plano
Write-Host "`n[1/2] Iniciando Backend FastAPI en http://localhost:8000..." -ForegroundColor Green
Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\Activate.ps1; uvicorn main:app --reload --port 8000"

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "`n[2/2] Iniciando Frontend Next.js en http://localhost:3000..." -ForegroundColor Green
cd frontend
npm run dev
