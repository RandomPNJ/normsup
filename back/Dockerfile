FROM node:8
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN apt-get update && apt-get install netcat -y && \
  npm install -g grunt && \
  mkdir -p /usr/src/app/ && \
  cd /tmp && npm install --loglevel error && \
  mv /tmp/node_modules /usr/src/app/node_modules

ADD . /usr/src/app
WORKDIR /usr/src/app

# RUN grunt build
