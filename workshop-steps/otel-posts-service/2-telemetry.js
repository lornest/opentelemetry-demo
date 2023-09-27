const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics')
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const otel = require('@opentelemetry/api');
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

    /**
     * Initialize the metric exporter
     */
    const metricExporter = new OTLPMetricExporter({
        url: `${OTEL_ENDPOINT}/v1/metrics`
    });

    const meterProvider = new MeterProvider({
        resource: Resource.default().merge(serviceResource),
    });

    /**
     * Setup the PeriodicExportingMetricReader with metricExporter and
     * an export interval of 1000ms.
     * 
     * You should set the export interval based on your observability needs.
     * It could add network overhead to the application.
     */
    meterProvider.addMetricReader(new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 1000,
    }));

    /**
     * This can be uncommented to export the metrics to the console to verify they are being generated.
     */
    // meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    //     exporter: new ConsoleMetricExporter(),
    //     exportIntervalMillis: 10000
    // }));
      

    // set this as the global meter provider
    otel.metrics.setGlobalMeterProvider(meterProvider);

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