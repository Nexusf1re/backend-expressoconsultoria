#!/bin/bash

# Analytics API Setup Script
echo "🚀 Setting up Analytics API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your database configuration."
else
    echo "✅ .env file already exists."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Check if MySQL is running (for local development)
if command -v mysql &> /dev/null; then
    echo "🗄️  MySQL detected. You can now run migrations and seeds."
    echo "   Run: npm run prisma:migrate"
    echo "   Run: npm run prisma:seed"
fi

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. You can use Docker for development:"
    echo "   Run: npm run docker:up"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database configuration"
echo "2. Run: npm run prisma:migrate"
echo "3. Run: npm run prisma:seed"
echo "4. Run: npm run dev"
echo ""
echo "Or use Docker:"
echo "1. Run: npm run docker:build"
echo ""
echo "Documentation available at: http://localhost:3000/docs"
