FROM node:8

RUN mkdir -p /usr/src/app && \
  chown -R node:node /usr/src/app && \
  chown -R node:node /usr/local/lib/node_modules && \
  chown -R node:node /usr/local/bin/

RUN npm install -g npm@5.6.0

USER node
ADD package.json /tmp/package.json
ADD angular-bootstrap-md-7.5.4.tgz /tmp/angular-bootstrap-md-7.5.4.tgz

RUN ls /tmp

RUN npm install -g @angular/cli@6.2.7
RUN cd /tmp && npm install && \
  mv /tmp/node_modules /usr/src/app/node_modules

ADD . /usr/src/app
WORKDIR /usr/src/app

# RUN npm install -g @angular/cli@6.2.7
# RUN cd /usr/src/app && npm install

USER root

EXPOSE 4200
