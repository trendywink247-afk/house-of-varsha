@echo off
echo 🚀 Starting House of Varsha Development Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo 💡 Please install Node.js from https://nodejs.org/
    echo 💡 Then restart this script
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed or not in PATH
    echo 💡 Please install Node.js with npm from https://nodejs.org/
    echo 💡 Then restart this script
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check for environment file
if not exist ".env.local" (
    if exist ".env.example" (
        echo ⚠️  Creating .env.local from .env.example
        copy .env.example .env.local >nul
        echo 💡 Please edit .env.local with your configuration
    ) else (
        echo ⚠️  No environment file found
        echo 💡 Create .env.local with your configuration
    )
)

echo.
echo 🌟 Starting development server...
echo 💡 Open http://localhost:3000 in your browser
echo 💡 Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev