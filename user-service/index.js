const { initTelemetry } = require('./src/instrumentation')

/**
 * Initialize OpenTelemetry before loading the application.
 */
initTelemetry('user-service')

/**
 * Load the application.
 */
if (process.env.NODE_ENV === 'production') {
  require('./dist')
} else {
  require('nodemon')({script: 'dev.js'})
}
