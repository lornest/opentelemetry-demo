const otel = require('@opentelemetry/api');
// Below is the OTel response-time library
const responseTime = require('response-time');
const apiMeter = otel.metrics.getMeter('posts-meter');


exports.initMeters = (app) => {
    /**
     * Custom Metric: number of API requests
     * Here we are using a counter to measure the number of requests received by the API
     */
    const requestCounter = apiMeter.createCounter('api.request.count', {
        description: "Number of requests received by the API",
        unit: 'requests'
    });

    /**
     * Using a histogram to record the response latency of the API call
     */
    const responseLatency = apiMeter.createHistogram('api.requests.latency', {
        description: 'Measure of the API request latency',
        unit: 'milliseconds',
    });

    /**
     * Middleware to record the response latency of the API call
     * Uses the 'response-time' library
     */
    app.use(responseTime(function (req, res, time) {
        console.log("Recording latency");

        /**
         * Record the response latency with the attributes:
         * - http.method
         * - req.path
         * - res.status
         * These will be added as labels in prometheus and can be used to filter data.
         */
        responseLatency.record(time, { "http.method": req.method, "req.path": req.path, "res.status": res.statusCode });
    }));

    /**
     * Middleware to record the number of requests received by the API
     * Increments the counter by 1 for each request on 'close' event to get the response status
     */
    app.use((req, res, next) => {
        console.log("Recording api count");
        res.on('close', () => {
        /**
         * Record the counter with the attributes:
         * - http.method
         * - req.path
         * - res.status
         * These will be added as labels in prometheus and can be used to filter data.
         */
            requestCounter.add(1, { "http.method": req.method, "req.path": req.path, "res.status": res.statusCode });
        });
        next();
    });
}