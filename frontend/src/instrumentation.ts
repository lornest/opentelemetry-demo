import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { W3CTraceContextPropagator, W3CBaggagePropagator, CompositePropagator } from '@opentelemetry/core';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';

// service.namespace is an incubating attribute, so we use a string literal
const ATTR_SERVICE_NAMESPACE = 'service.namespace';

export const initTelemetry = function (serviceName: string) {

    const OTEL_ENDPOINT = 'http://localhost:4318';

    const traceExporter = new OTLPTraceExporter({
        url: `${OTEL_ENDPOINT}/v1/traces`
    });

    const resource = Resource.default().merge(new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_NAMESPACE]: 'otel-demo',
    }));

    const tracerProvider = new WebTracerProvider({
        resource,
        spanProcessors: [new BatchSpanProcessor(traceExporter)],
    });

    tracerProvider.register({
        contextManager: new ZoneContextManager(),
        propagator: new CompositePropagator({
            propagators: [
                new W3CTraceContextPropagator(),
                new W3CBaggagePropagator(),
            ],
        }),
    });

    registerInstrumentations({
        instrumentations: [
            getWebAutoInstrumentations({
                '@opentelemetry/instrumentation-fetch': {
                    propagateTraceHeaderCorsUrls: /(localhost)/g,
                },
                '@opentelemetry/instrumentation-xml-http-request': {
                    propagateTraceHeaderCorsUrls: /(localhost)/g,
                },
            }),
        ],
    });

    const tracer = tracerProvider.getTracer(serviceName);
    return { tracer };
}
