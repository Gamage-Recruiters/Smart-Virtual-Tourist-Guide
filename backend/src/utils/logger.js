const winston = require("winston");

/**
 * System Logger
 * 
 * Description:
 * This creates a centralized logging system. Instead of using 'console.log', 
 * we use this logger to automatically save important system events and errors into files.
 */
const logger = winston.createLogger({
  // Record all messages that are 'info' level or more critical (like 'warn' and 'error')
  level: "info",
  
  // Format the logs by adding a timestamp and structuring them as JSON.
  // JSON format is highly recommended for production because it is easy to analyze using monitoring tools.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  
  // Transports define WHERE the logs should be saved
  transports: [
    // 1. Save ONLY 'error' level messages into the error.log file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    
    // 2. Save ALL messages (info, warnings, and errors) into the combined.log file
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

/**
 * If the application is NOT running in the live production environment 
 * (e.g., we are developing or testing it locally), 
 * also print the logs to the terminal/console in a simple, easy-to-read format.
 */
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

module.exports = logger;