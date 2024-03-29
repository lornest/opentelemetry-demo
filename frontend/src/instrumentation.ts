import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';

export const initTelemetry = function (serviceName: string) {

    const OTEL_ENDPOINT = 'http://localhost:4318';

    const traceExporter = new OTLPTraceExporter({
        url: `${OTEL_ENDPOINT}/v1/traces`
    });

    const tracerProvider = new WebTracerProvider({
        resource: Resource.default().merge(new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'otel-demo',
        })),
    });

    tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

    tracerProvider.register({
        propagator: new W3CTraceContextPropagator(),
    });


    // const metricExporter = new OTLPMetricExporter({
    //     url: 'http://host.docker.internal:4318/v1/metrics',
    // });

    // const meterProvider = new MeterProvider({
    //     resource: new Resource({
    //         [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    //     }),
    // });

    // meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    //     exporter: metricExporter,
    //     exportIntervalMillis: 10000,
    // }));

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
