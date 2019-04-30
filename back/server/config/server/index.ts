/**
 * HTTP server based on express app
 * 1.0.0
 */

import * as http from 'http';
import {Promise} from 'bluebird';

export default class Server {

  expressApp: any;
  config    : any;
  logger    : any;
  stream    : any;
  server    : any;

  constructor(expressApp, config, logger) {
    this.expressApp = expressApp;
    this.config = config;
    this.logger = logger;

    this.stream = null;
    this.server = http.createServer(expressApp);
  }

  start() {
    this.stream = this.server.listen(this.config.port, this.config.ip, () => this.logger.info(
      `${this.config.appName} server listening on ${this.config.port}, in ${this.expressApp.get('env')} mode`
    ));
    this.stream.on('close', () => this.logger.debug(`${this.config.appName} server closed`));
  }

  stop() {
    if (!this.stream) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.stream.close(() => {
        resolve();
      });
    });
  }
}
