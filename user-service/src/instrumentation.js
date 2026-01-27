import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';

// service.namespace is an incubating attribute, so we use a string literal
const ATTR_SERVICE_NAMESPACE = 'service.namespace';

// Setup the OpenTelemetry diag logger to print to the console
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const serviceName = 'user-service';

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
        new PgInstrumentation(),
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
