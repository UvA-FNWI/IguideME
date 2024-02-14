FROM ubuntu:jammy AS build

RUN mkdir /app
WORKDIR /app

RUN apt-get update && apt-get install -y curl git
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash -
RUN apt-get install -y nodejs

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:1.23.2-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN echo "window.DEBUGFLAG = true" >> /usr/share/nginx/html/debugflag.js
