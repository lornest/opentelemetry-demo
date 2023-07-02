FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD [ "node", "." ]
