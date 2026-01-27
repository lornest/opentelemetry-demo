const { NodeSDK } = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// service.namespace is an incubating attribute, so we use a string literal
const ATTR_SERVICE_NAMESPACE = 'service.namespace';
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');
const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');

// Setup the OpenTelemetry diag logger to print to the console
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const initTelemetry = function (serviceName) {
    const traceExporter = new OTLPTraceExporter({
        url: 'http://otel-collector:4318/v1/traces'
    });

    const sdk = new NodeSDK({
        resource: Resource.default().merge(new Resource({
            [ATTR_SERVICE_NAME]: serviceName,
            [ATTR_SERVICE_NAMESPACE]: 'otel-demo',
        })),
        traceExporter,
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new WinstonInstrumentation(),
        ],
    });

    sdk.start();

    // Graceful shutdown
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('OpenTelemetry SDK shut down successfully'))
            .catch((error) => console.log('Error shutting down OpenTelemetry SDK', error))
            .finally(() => process.exit(0));
    });
}

module.exports = { initTelemetry }
