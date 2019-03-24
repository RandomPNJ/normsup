/**
 * Monitoring routes
 * 1.3.0
 */

import _ from 'lodash';
import Promise from 'bluebird';

function getStatusState(bool) {
  const newBool = !_.isArray(bool) ? bool : _.every(bool);
  return newBool ? 'OK' : 'KO';
}

export function getStatus(app, getDepsState = true) {
  const status = {
    moduleState: 'Statut UP', // default value if no deps check
  };

  if (app.has('config')) {
    const config = app.get('config');
    if (config.appName) {
      status.name = config.appName;
    }

    if (config.appVersion) {
      status.version = config.appVersion;
    }
  }

  if (!getDepsState) {
    return Promise.resolve(status);
  }

  return Promise.map(app.getAll(), (serviceName) => {
    return (getDepsState ? app.getService(serviceName).check() :
        app.get(serviceName, { asStatic: false })) // no check if already up
      .return({ [serviceName]: true })
      .catch(() => {
        return { [serviceName]: false };
      })
    ;
  })
    .then(results => _.assign({}, ...results))
    .then((log) => {
      loggerT.verbose('[MONITORING] Services to monitor responded');
      status.moduleState = 'Statut ' + getStatusState(log); // default value since it responds

      status.dependenciesStates = _.reduce(log, (acc, serviceBool, serviceName) => {
        if (!serviceBool) {
          acc[serviceName] = false;
          return acc;
        }

        acc[serviceName] = app.getService(serviceName).hasCheck() ? true : 'no check';
        return acc;
      }, {});

      return status;
    })
  ;
}

const monitoringActions = {
  name: 'monitoring',
  uri: '',
  actions: [],
};

const swaggerAction = {
  description: 'Returns this!',
  name: 'swagger',
  uriPattern: '/_swagger',
  method: 'get',
  handler: (req, res, app) => app.get('swagger'),
};

const statusAction = {
  description: 'Returns status for module and all of its dependencies',
  name: 'monitoring',
  uriPattern: '/_status',
  method: 'get',
  handler: (req, res, app) => getStatus(app, !req.query.noDeps),
};

export default function getMonitoringRoutes(showStack = true) {
  if (!showStack) {
    statusAction.handler = (req, res, app) => getStatus(app, !req.query.noDeps)
      .then((res) => {
        delete res.dependenciesStates;
        delete res.appVersion;
        return res;
      })
    ;
    monitoringActions.actions.push(statusAction);
    return monitoringActions;
  }

  monitoringActions.actions.push(statusAction);
  monitoringActions.actions.push(swaggerAction);
  return monitoringActions;
}
