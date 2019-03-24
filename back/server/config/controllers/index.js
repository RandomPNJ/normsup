/**
 * controllers
 * 2.6.3
 */

import _ from 'lodash';
import Joi from 'joi';
import path from 'path';
import Promise from 'bluebird';

import formatModelUri from './formatModelUri';
import getMonitoringRoutes from './monitoringRoutes';

const OptionsSchema = Joi.object().keys({
  logger: Joi.object().required(),
  apiRoot: Joi.string().optional(),
  noDescription: Joi.object().optional(),
  showStack: Joi.boolean().optional(),
});

const defaults = {
  apiRoot: __dirname,
  noDescription: 'No description yet, write it up!',
  showStack: true,
};

const ModelConfigSchema = Joi.object().keys({
  name: Joi.string().required().alphanum(),
  customPath: Joi.string().optional(),
  uri: Joi.string().required().allow(''),
  actions: Joi.any().optional(),
  services: Joi.array().optional(),
  showStack: Joi.boolean().optional(),
});

const ActionConfigSchema = Joi.object().keys({
  description: Joi.any().optional(),
  name: Joi.string().required().alphanum(),
  path: Joi.string().optional(),
  method: Joi.string().optional(),
  uriPattern: Joi.string().optional().allow(''),
  handler: Joi.func().optional(),
  route: Joi.func().optional(),
  services: Joi.array().optional(),
  showStack: Joi.boolean().optional(),
});

const ActionSchema = Joi.object().keys({
  description: Joi.any().optional(),
  name: Joi.string().required().alphanum(),
  method: Joi.string().required(),
  uriPattern: Joi.string().required().allow(''),
  handler: Joi.func().optional(),
  route: Joi.func().optional(),
  services: Joi.array().optional(),
  showStack: Joi.boolean().optional(),
});

export default (expressApp, app, models, localOptions = {}) => {
  Joi.assert(localOptions, OptionsSchema);

  const options = _.defaults(localOptions, defaults);
  const logger = options.logger;

  const loadingModels = _.merge({}, models, { _monitoring: getMonitoringRoutes(localOptions.showStack) });

  return _.reduce(loadingModels, (swagger, modelConfig, modelName) => {
    if (!modelConfig.name) {
      modelConfig.name = modelName;
    }

    try {
      Joi.assert(modelConfig, ModelConfigSchema);
    } catch (err) {
      logger.error(`Invalid model config for model ${modelConfig.name}: ${err.message}`, err);
      return swagger;
    }

    _.forEach(modelConfig.actions, (actionConfig, actionName) => {
      if (_.isObject(actionConfig.actions) && !actionConfig.name) {
        actionConfig.name = actionName;
      }

      try {
        Joi.assert(actionConfig, ActionConfigSchema);
      } catch (err) {
        logger.error(`Invalid action config for model ${modelConfig.name}: ${err.message}`, err);
        return;
      }

      const actionPath = getPath(actionConfig, modelConfig);
      const absolutePath = path.join(options.apiRoot, actionPath);

      let actionFile;
      try {
        actionFile = require(absolutePath).default;
      } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND' || !_.includes(e.message, absolutePath)) {
          throw e;
        }
        // no throw, default file is required
        logger.verbose(`No action file found for path ${absolutePath}`);
      }

      // config has priority on file
      const action = _.defaultsDeep({}, _.omit(actionConfig, ['path']), actionFile);
      logger.verbose('Conf data', _.omit(actionConfig, ['path']));
      logger.verbose('File data', actionFile);
      logger.verbose('Resulting action to register', action);

      try {
        Joi.assert(action, ActionSchema);
      } catch (err) {
        logger.error(`Invalid action for model ${modelName}: ${err.message}`, err);
        return;
      }

      // del is now deprecated in express. Use delete.
      const expressAction = action.method.toLowerCase();
      if (!expressApp[expressAction]) {
        throw new Error(`Action "${action.name}" for model ` +
          `"${modelConfig.name}" is invalid [${actionPath}]: invalid method ${expressAction}`);
      }

      if (!_.isFunction(action.handler) && !_.isFunction(action.route)) {
        logger.debug(`Setting not Implemented handler for "${modelConfig.name}"`);
        action.handler = (req, res) => {
          res.status(501).json({ status: 'ko', message: 'Not yet implemented' });
        };
      }

      const services = _.merge([], modelConfig.services, action.services);

      const uri = formatModelUri(modelConfig.uri) + action.uriPattern;

      swagger[uri] = swagger[uri] || {};
      swagger[uri][expressAction] = action.description || options.noDescription;

      const routeData = {
        uri,
        method: expressAction,
        app,
        expressApp,
        logger,
        name: `${modelConfig.name}.${action.name}`,
        modelName: modelConfig.name,
        modelConfig,
        actionName: action.name,
        ..._.omit(action, ['route', 'handler', 'services', 'name', 'method']),
        services,
        showStack: getShowStack(action.showStack, modelConfig.showStack, options.showStack),
      };

      if (_.isFunction(action.route)) {
        return action.route(expressApp, routeData);
      }

      expressApp[expressAction](uri, _.partial(moulinetteHandler, action.handler, routeData));
      logger.info(`Registered "${actionConfig.name}" for "${modelConfig.name}" (${action.method}: ${uri})`);
    });

    return swagger;
  }, {});
};

export function moulinetteHandler(handler, options, req, res) {
  const logObject = {
    uri: options.uri,
    method: options.method,
    name: options.name,
  };

  return options.app.waitForUpAndRunning(options.services, { retryUpAndRunning: 0 })
    .then(() => Promise.method(handler)(req, res, options.app))
    .catch((err) => {
      if (res.headersSent) {
        options.logger.debug('Error finished', logObject);
        return;
      }

      const logLevel = !err.statusCode || err.statusCode === 500 ? 'error' : 'debug';
      options.logger.log(logLevel, `Error sent: [${err.statusCode || 500}] ${err.message}`, logObject);
      res.status(err.statusCode || 500).json(_.isError(err) ? {
        name: err.name,
        message: err.message,
        code: err.code,
        statusCode: err.statusCode || 500,
        stackTrace: options.showStack ? err.stack : undefined,
      } : err);
    })
    .then((data) => {
      if (res.headersSent) {
        options.logger.debug('Res finished', logObject);
        return;
      }

      options.logger.debug('Res sent', logObject);
      res.status(res.statusCode || 200).json(_.isObject(data) ? data : {data});
    })
  ;
}

export function getPath(actionConfig, modelConfig) {
  let path = './<%=modelName%>/<%=actionName%>.action';

  if (modelConfig.customPath) {
    path = modelConfig.customPath;
  }

  if (actionConfig.path) {
    path = actionConfig.path;
  }

  return _.template(path)({
    actionName: actionConfig.name,
    modelName: modelConfig.name,
  });
}

export function getShowStack(action, model, config) {
  if (!_.isUndefined(action)) {
    return action;
  }

  return !_.isUndefined(model) ? model : config;
}
