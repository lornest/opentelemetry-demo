# OpenTelemetry Demo Project

This repo contains a simple microservice based application to demonstrate using OpenTelemetry.

# Local Setup
There is a Makefile included in the root of the project. If you use Make you can run the project with:

`make up_build`

This will build all necessary Docker images and run Docker compose. Alternatively, you can run the Docker command directly:

`docker-compose up --build -d`

# Usage
The UI has not been built yet. At the moment, you can query the `/orders` API directly on the endpoint `http://localhost:5002/api/orders`.

Make a `POST` request with the following body:

```json
{ 
	"userId": 1
}
```

You'll see a request of varying latency and also varying success. Head over to [Grafana](http://localhost:3000/explore?orgId=1&left=%7B%22datasource%22:%22tempo%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22datasource%22:%7B%22type%22:%22tempo%22,%22uid%22:%22tempo%22%7D,%22queryType%22:%22nativeSearch%22,%22limit%22:20%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D) and click `Run Query` to see the trace.
