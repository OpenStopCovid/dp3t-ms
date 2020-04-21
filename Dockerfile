FROM node:12-alpine

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn --prod
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app
ADD . /app

# Expose our server port.
EXPOSE 3000
