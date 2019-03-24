/**
 * Express config
 * 1.0.2
 */

import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import moment from 'moment';

export default (expressApp) => {
  expressApp.use(helmet());
  expressApp.use(compression());
  expressApp.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000}));
  expressApp.use(bodyParser.json({ limit: '50mb' }));
  expressApp.use(methodOverride());

  // Disable caching
  expressApp.use(helmet.noCache());
  expressApp.disable('etag');

  // Configuration serveur (CORS)
  expressApp.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200).end();
    }

    next();
  });

  // Add logs
  expressApp.use('/', (req, res, next) => {
    loggerIO.log('verbose', `[INPUT][${req.method}][${req.url}]`, {
      params: req.params,
      url: req.url,
      method: req.method,
      datetime: moment.utc().toISOString(),
    });
    next();
  });
};
