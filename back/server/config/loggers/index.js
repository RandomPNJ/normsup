/**
 * Loggers
 * 1.6.3
 */

import fs from 'fs';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import _ from 'lodash';
import moment from 'moment';

export const fileDefaultConfig = {
  handleExceptions: true,
  maxsize: 10000000,
  maxFiles: 10,
  datePattern: '.yyyy-MM-dd.log',
};

export const consoleDefaultConfigs = {
  local: {
    timestamp: () => moment.utc().toISOString(),
    colorize: true,
    prettyPrint: true,
    stringify: false,
    json: false,
    silent: false,
    humanReadableUnhandledException: true,
  },
  development: {
    timestamp: () => moment.utc().toISOString(),
    colorize: false,
    prettyPrint: false,
    stringify: true,
    json: true,
    silent: false,
    humanReadableUnhandledException: true,
  },
  production: {
    timestamp: () => moment.utc().toISOString(),
    colorize: false,
    prettyPrint: false,
    stringify: true,
    json: true,
    silent: false,
    humanReadableUnhandledException: false,
  },
};

export const generateLogger = (env, logDir, name, loggerConfig) => {
  if (!loggerConfig) {
    throw new Error(`Logger config "${ name }" is required. Please provide it.`);
  }

  const loggerConfigure = {
    level: loggerConfig.level,
    transports: [],
  };

  if (loggerConfig.file) {
    loggerConfigure.transports.unshift(new WinstonDaily(_.merge({
      name,
      level: loggerConfig.level,
      filename: logDir + '/log-' + name,
    }, fileDefaultConfig, loggerConfig.file)));
  }

  if (loggerConfig.console) {
    let consoleConfig = _.isObject(loggerConfig.console) ? loggerConfig.console :
      _.get(consoleDefaultConfigs, env, {});
    if (_.isString(loggerConfig.console)) {
      consoleConfig = _.get(consoleDefaultConfigs, loggerConfig.console) || consoleConfig;
    }
    consoleConfig = _.merge({
      name,
      level: loggerConfig.level,
    }, consoleConfig);
    loggerConfigure.transports.unshift(new (winston.transports.Console)(consoleConfig));
  }

  const logger = new (winston.Logger)(loggerConfigure);

  if (loggerConfig.process) {
    process.on('uncaughtException', err => logger.error('Uncaught exception:', err));
    process.on('exit', code => {
      if (code === 0) {
        return;
      }
      logger.error(`Exit with code: ${code}`);
    });
    process.on('unhandledRejection', err => logger.error('Unhandled rejection:', err));
    process.on('rejectionHandled', err => logger.error('Rejection handled:', err));
  }

  return logger;
};

export const init = (env, logDir, loggersConfig, app) => {
  if (!logDir) {
    throw new Error('A log directory is required');
  }

  // Création du dossier de log winston
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  _.forEach(loggersConfig || {}, (val, key) => {
    global[key] = global[key] || generateLogger(env, logDir, key, val);
    if (app) {
      app.set('logger:' + key, global[key], { private: true });
    }
  });
};
