### STAGE 1: Setup the environment & install dependencies ###
FROM node:16.18-buster-slim AS setup

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

### STAGE 2: Run the app in development mode ###
FROM setup AS development
CMD ["npm", "run", "dev"]

