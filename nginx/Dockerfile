FROM nginx:1.25.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d

WORKDIR /usr/src/app