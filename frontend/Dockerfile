### STAGE 1: Setup the environment & install dependencies ###
FROM node:22-slim AS setup

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

### STAGE 2: Run the app in development mode ###
FROM setup AS development
EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
