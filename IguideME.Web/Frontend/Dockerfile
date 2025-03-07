FROM node:23-alpine
LABEL org.opencontainers.image.source=https://github.com/UvA-FNWI/IguideME
WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "demo"]
