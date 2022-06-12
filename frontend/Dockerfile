FROM node:lts-alpine3.14

RUN apk add bash

COPY ./package.json /application/frontend/package.json

WORKDIR application/frontend

RUN npm install --legacy-peer-deps
RUN npm install -g serve

COPY ./src ./src
COPY ./public ./public

RUN npm run build

ENTRYPOINT ["serve", "-s", "build"]
