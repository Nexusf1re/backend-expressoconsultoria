@echo off
echo 🚀 Starting Analytics API in development mode...

REM Check if .env exists
if not exist .env (
    echo ❌ .env file not found. Please run setup first:
    echo    npm run setup
    exit /b 1
)

REM Check if database is accessible
echo 🔍 Checking database connection...
npm run prisma:generate

REM Start development server
echo 🔥 Starting development server...
npm run dev
