FROM nginx:1.21.6-alpine

COPY build /usr/share/nginx/html
RUN echo "window.DEBUGFLAG = true" >> /usr/share/nginx/html/debugflag.js
