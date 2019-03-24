/**
 * Credentials
 * 1.2.0
 */

import _ from 'lodash';

/**
 * Parse VCAP_SERVICES env variable
 */
export const findServiceCredentialsFromVCAP = (nameVCAP) => {
  try {
    const VCAP_SERVICES = process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES);
    return VCAP_SERVICES && {}.hasOwnProperty.call(VCAP_SERVICES, 'user-provided') &&
      _.isArray(VCAP_SERVICES['user-provided']) &&
      VCAP_SERVICES['user-provided'].find(userProvided => userProvided && userProvided.name === nameVCAP) || undefined;
  }
  catch (e) {
    throw new Error('Unable to parse VCAP_SERVICES');
  }
};

/**
 * Return the right VCAP conf from dot notation
 */
export default function getEnvVar(envVarName, processVar) {
  const [blueMixServiceName, ...rest] = _.split(envVarName, '.');
  const blueMixService = findServiceCredentialsFromVCAP(blueMixServiceName);

  if (!blueMixService || !blueMixService.credentials) {
    return process.env[processVar];
  }

  if (_.isEmpty(rest)) {
    return blueMixService.credentials;
  }

  return _.get(blueMixService.credentials, rest.join('.'), null);
}

export const toUrl = (dbConfig, scheme='http') => {
  if (!dbConfig) {
    return null;
  }

  let url = scheme + '://';
  if (dbConfig.user && dbConfig.password) {
    url += dbConfig.user + ':' + dbConfig.password + '@';
  }
  url += _.get(dbConfig, 'host', '');
  if (dbConfig.port) {
    url += ':' + dbConfig.port;
  }
  return url;
};

export function isTrue(value) {
  return value && value !== 'false';
}
