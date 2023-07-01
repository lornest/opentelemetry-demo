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

# FROM node:20-alpine AS build

# WORKDIR /usr/src/app/

# COPY package*.json ./

# RUN npm ci --omit=dev
# RUN npm run build

# # -----------------------------------------------------------------------------

# FROM node:20-alpine

# USER node
# WORKDIR /usr/src/app/
# ENV PORT=3000
# ENV NODE_ENV=production

# COPY . .

# EXPOSE 3000
# ENTRYPOINT [ "node", "." ]