@echo off
echo ==========================================
echo   House of Varsha - Persistent Dev Server
echo ==========================================
echo.
echo This server will auto-restart if it crashes
echo Press Ctrl+C to stop
echo.
echo Starting server...
echo.

:: Set environment variables for stability
set NODE_OPTIONS=--max-old-space-size=4096 --no-warnings
set NEXT_TELEMETRY_DISABLED=1
set WATCHPACK_POLLING=true

:: Start the persistent dev server
node dev-server.js

pause