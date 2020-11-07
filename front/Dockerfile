FROM node:10

RUN mkdir -p /usr/src/app && \
  chown -R node:node /usr/src/app && \
  chown -R node:node /usr/local/lib/node_modules && \
  chown -R node:node /usr/local/bin/

RUN npm install -g npm@5.6.0

USER node
ADD package.json /tmp/package.json

RUN ls /tmp

RUN npm install -g @angular/cli@6.2.7
RUN cd /tmp && npm install && \
  mv /tmp/node_modules /usr/src/app/node_modules

ADD . /usr/src/app
WORKDIR /usr/src/app

# RUN npm install -g @angular/cli@6.2.7
# RUN cd /usr/src/app && npm install
USER root

RUN npm run prefixcss


EXPOSE 4200
