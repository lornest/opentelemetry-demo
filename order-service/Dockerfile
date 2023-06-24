FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT=3000
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

# Define the command to start the app
CMD [ "node", "." ]