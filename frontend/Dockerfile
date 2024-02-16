###########
# BUILDER #
###########

# pull official base image
FROM node:21-alpine3.18 as builder

# set work directory
WORKDIR /usr/src/app

# install dependencies and avoid `node-gyp rebuild` errors
COPY ./app/package.json .
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && npm install \
    && apk del .gyp

# copy our react project
COPY ./app .

# perform npm build
ARG VITE_MODE
RUN npm run build -- --mode ${VITE_MODE}

#########
# FINAL #
#########

# pull official base image
FROM node:21-alpine3.18 

# set work directory
WORKDIR /usr/src/app

# install serve - deployment static server suggested by official create-react-app
RUN npm install -g serve

# copy our build files from our builder stage
COPY --from=builder /usr/src/app/dist ./build