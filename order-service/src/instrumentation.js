const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { metrics, DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { W3CTraceContextPropagator } = require('@opentelemetry/core');
const { FetchInstrumentation } = require('opentelemetry-instrumentation-fetch-node');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { WinstonInstrumentation } = require('@opentelemetry/instrumentation-winston');

// Setup the OpenTelemetry diag logger to print to the console.
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const initTelemetry = function (serviceName) {

    /**
     * Initialize the trace exporter
     */
    const tracerProvider = new NodeTracerProvider({
        resource: Resource.default().merge(new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            [SemanticResourceAttributes.SERVICE_NAMESPACE]: "otel-demo",
        })),
    });

    const traceExporter = new OTLPTraceExporter({
        url: `http://otel-collector:4318/v1/traces`
    });

    tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
    tracerProvider.register();

    registerInstrumentations({
            instrumentations: [
                new FetchInstrumentation(),
                new HttpInstrumentation(),
                new ExpressInstrumentation(),            
                new PgInstrumentation(),         
                new WinstonInstrumentation(),
            ],
    });
}

module.exports = { initTelemetry }
