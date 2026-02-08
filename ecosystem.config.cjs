/**
 * PM2 Ecosystem Configuration
 * Usage: pm2 start ecosystem.config.cjs
 */

module.exports = {
  apps: [
    {
      name: 'house-of-varsha',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Auto-restart on failure
      autorestart: true,
      // Max memory before restart
      max_memory_restart: '500M',
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Don't run as daemon (for systemd integration)
      // daemon: false,
      // Kill timeout
      kill_timeout: 5000,
      // Listen timeout
      listen_timeout: 10000,
      // Watch mode (disabled in production)
      watch: false,
      // Ignore watch patterns
      ignore_watch: ['node_modules', 'logs', 'dist'],
      // Merge logs
      merge_logs: true,
      // Time to wait before forcing restart
      shutdown_with_message: true,
      // Cron restart (optional - restart at 3 AM daily)
      // cron_restart: '0 3 * * *',
    }
  ]
};
