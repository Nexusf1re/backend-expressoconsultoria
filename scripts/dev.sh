#!/bin/bash

# Development script for Analytics API
echo "🚀 Starting Analytics API in development mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run setup first:"
    echo "   npm run setup"
    exit 1
fi

# Check if database is accessible
echo "🔍 Checking database connection..."
npm run prisma:generate

# Start development server
echo "🔥 Starting development server..."
npm run dev
