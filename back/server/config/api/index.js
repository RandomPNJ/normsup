/**
 * API service registration
 * 1.3.1
 */

import _ from 'lodash';

import API from './api';

export default function register(app, apis, logger) {
  _.forEach(apis || [], (apiConfig, apiName) => {
    const apiService = new API(apiName, apiConfig, app, logger);
    const serviceName = 'api:' + apiName;
    app.set(serviceName, apiService);
  });
}
