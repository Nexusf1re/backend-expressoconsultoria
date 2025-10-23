@echo off
echo 🚀 Setting up Analytics API...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment file
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please edit it with your database configuration.
) else (
    echo ✅ .env file already exists.
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run prisma:generate

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your database configuration
echo 2. Run: npm run prisma:migrate
echo 3. Run: npm run prisma:seed
echo 4. Run: npm run dev
echo.
echo Or use Docker:
echo 1. Run: npm run docker:build
echo.
echo Documentation available at: http://localhost:3000/docs
