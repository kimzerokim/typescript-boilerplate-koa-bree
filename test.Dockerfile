FROM node:16-slim
WORKDIR /test
COPY . .
RUN yarn install