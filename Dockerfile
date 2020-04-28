FROM node:12-alpine as base

FROM base as base-prod

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn --prod
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# Define working directory
WORKDIR /app
ADD . /app


FROM base as base-dev

RUN apk add curl jq bash git
ADD yarn.lock .
RUN yarn global add nyc ava xo
RUN yarn add ava xo supertest micro


FROM base-dev as tester

WORKDIR /app
COPY --from=base-prod /app .

COPY config/codes.yaml.sample config/codes.yaml
COPY .env.tester .env
RUN ls -l /app/config


FROM base-prod

# Expose our server port.
EXPOSE 3000
