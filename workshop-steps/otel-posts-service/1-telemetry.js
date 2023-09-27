const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Logs the telemetery logs into console for debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const initTelemetry = function (serviceName) {
    /**
     * Get the Endpoint for the OTEL Collector
     * Endpoints can also be set directly through the env variables
     * Refer here: https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http#:~:text=Configuration%20options%20as%20environment%20variables
     */
    const OTEL_ENDPOINT = process.env.OTEL_ENDPOINT ? process.env.OTEL_ENDPOINT : 'http://otel-collector:4318';

    /**
     * Create a 'Resource' with the service name and service namespace
     * This can be used to categorize data in the backend
    */
    const serviceResource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [SemanticResourceAttributes.SERVICE_NAMESPACE]: process.env.SERVICE_NAMESPACE,
    })

    /**
     * Initialize the trace exporter
     */
    const traceExporter = new OTLPTraceExporter({
        url: `${OTEL_ENDPOINT}/v1/traces`
    });

    const tracerProvider = new NodeTracerProvider({
        resource: Resource.default().merge(serviceResource),
    });

    tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
    tracerProvider.register();
    
    /***
     * Register the instrumentations needed
     * In this case we are using the node auto instrumentation fetcher
     */
    registerInstrumentations({
        instrumentations: [
            getNodeAutoInstrumentations(),
        ],
    });
}

module.exports = { initTelemetry }