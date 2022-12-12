RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

RUN npm install
RUN npm run build

FROM nginx:1.21.6-alpine

COPY build /usr/share/nginx/html
RUN echo "window.DEBUGFLAG = true" >> /usr/share/nginx/html/debugflag.js
