require('dotenv').config();
const { app } = require('../src/server');
const logger = require('../src/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Add request start time for performance monitoring
    const start = Date.now();
    
    // Log incoming requests
    logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
      headers: req.headers,
      query: req.query,
      body: req.body
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    // Handle the request with Express
    app(req, res, (error) => {
      if (error) {
        logger.error('Error handling request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
          });
        }
      }
    });

    // Log request completion time
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });

  } catch (error) {
    logger.error('Unhandled error in API handler:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }
};