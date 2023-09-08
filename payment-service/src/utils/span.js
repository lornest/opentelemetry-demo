import opentelemetry from "@opentelemetry/api";

const tracer = opentelemetry.trace.getTracer('payment-service');

async function callWithSpan(name, fn, ...args) {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn(...args);
      span.end();
      return result;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
      span.end();
      return
    }
  });
}
export { callWithSpan };