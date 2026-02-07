/**
 * Persistent Development Server
 * This script runs the Next.js dev server with auto-restart on crashes
 */

const { spawn } = require('child_process');
const path = require('path');

let serverProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 10;
const RESTART_DELAY = 3000;

function startServer() {
  if (restartCount >= MAX_RESTARTS) {
    console.error('❌ Maximum restart attempts reached. Please check your configuration.');
    process.exit(1);
  }

  restartCount++;
  console.log(`\n🚀 Starting Next.js dev server (attempt ${restartCount}/${MAX_RESTARTS})...`);
  console.log('⏰', new Date().toLocaleString());

  // Set environment variables for stability
  const env = {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096',
    NEXT_TELEMETRY_DISABLED: '1',
    // Disable polling for Windows stability
  };

  serverProcess = spawn('npx', ['next', 'dev', '--turbopack'], {
    stdio: 'inherit',
    shell: true,
    env,
    detached: false,
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    restartServer();
  });

  serverProcess.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGINT') {
      console.log('\n👋 Server stopped by user');
      process.exit(0);
    }
    
    if (code !== 0) {
      console.error(`\n⚠️ Server crashed with code ${code}`);
      restartServer();
    }
  });
}

function restartServer() {
  console.log(`\n🔄 Restarting in ${RESTART_DELAY / 1000} seconds...`);
  setTimeout(startServer, RESTART_DELAY);
}

function stopServer() {
  if (serverProcess) {
    console.log('\n🛑 Stopping server...');
    serverProcess.kill('SIGTERM');
  }
}

// Handle process termination gracefully
process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);
process.on('exit', stopServer);

// Catch uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  restartServer();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  restartServer();
});

// Start the server
startServer();

console.log('\n═══════════════════════════════════════════════════');
console.log('  🏠 House of Varsha - Persistent Dev Server');
console.log('═══════════════════════════════════════════════════');
console.log('  📍 Local: http://localhost:3000');
console.log('  🔄 Auto-restart: Enabled');
console.log('  🛑 Press Ctrl+C to stop');
console.log('═══════════════════════════════════════════════════\n');