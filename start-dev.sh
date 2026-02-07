#!/bin/bash

# House of Varsha Development Server Startup Script

echo "🚀 Starting House of Varsha Development Server..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "💡 Please install Node.js from https://nodejs.org/"
    echo "💡 Then restart this script"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required"
    echo "💡 Current version: $(node --version)"
    echo "💡 Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    echo "💡 Please install Node.js with npm from https://nodejs.org/"
    echo "💡 Then restart this script"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check for environment file
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  Creating .env.local from .env.example"
        cp .env.example .env.local
        echo "💡 Please edit .env.local with your configuration"
    else
        echo "⚠️  No environment file found"
        echo "💡 Create .env.local with your configuration"
    fi
fi

echo
echo "🌟 Starting development server..."
echo "💡 Open http://localhost:3000 in your browser"
echo "💡 Press Ctrl+C to stop the server"
echo

# Start the development server
npm run dev