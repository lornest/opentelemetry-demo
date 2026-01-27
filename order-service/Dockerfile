FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src/ src/

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "--import", "./src/instrumentation.js", "src/index.js"]
