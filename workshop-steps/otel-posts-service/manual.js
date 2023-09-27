const otel = require("@opentelemetry/api");

/**
 * Get a tracer using the @opentelemetry/api
 */
const tracer = otel.trace.getTracer('posts-tracer');

function moderatePost(post) {

    /**
     * Stars a span with the name `Post Moderation`
     * Acquire the span using the tracer
     */
    const moderateSpan = tracer.startSpan('Post Moderation');

    const result = isValidPost(post);
    if (result == "INVALID_LENGTH") {
        // set the status for the span
        // Refer here: https://opentelemetry.io/docs/instrumentation/js/instrumentation/#span-status
        moderateSpan.setStatus({
            code: otel.SpanStatusCode.ERROR,
        });
        // Add event attributes to add more data about the event
        // Refer here: https://opentelemetry.io/docs/instrumentation/js/instrumentation/#span-events
        moderateSpan.addEvent("Failed Moderation", {
            "error": "Length > 150 characters",
            "post": post
        });
        // Once the necessary actions are performed end the span.
        // If the span is not ended, the span will not be recorded properly
        moderateSpan.end();
        throw new Error("This post is not valid: INVALID_LENGTH");
    }

    else if (result === "OFFENSIVE") {
        moderateSpan.setStatus({
            code: otel.SpanStatusCode.ERROR,
        });
        moderateSpan.addEvent("Failed Moderation", {
            "error": "Contains Offensive words",
            "post": post
        });
        moderateSpan.end();
        throw new Error("This post is not valid: Contains OFFENSIVE WORDS");

    }
    moderateSpan.addEvent("Moderation Successful", {
        "post": post
    });
    moderateSpan.end();
    return true;
}
