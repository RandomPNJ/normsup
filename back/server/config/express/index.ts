/**
 * Express config
 * 1.0.2
 */

import * as helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import {useExpressServer, useContainer} from 'routing-controllers';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import config from '../environment';

declare var loggerT: any;
declare var loggerIO: any;

const methodOverride = require('method-override');
const moment = require('moment');
const secret = config.secret;

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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-access-token');

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

  let ExtractJwt = passportJWT.ExtractJwt;
  let JwtStrategy = passportJWT.Strategy;
  let jwtOptions = {};
  jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions['secretOrKey'] = secret;

  // lets create our strategy for web token
  // let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  //   console.log('payload received', jwt_payload);
  //   let user = getUser({ id: jwt_payload.id });
  //   if (user) {
  //     next(null, user);
  //   } else {
  //     next(null, false);
  //   }
  // });
  // use the strategy
  // passport.use(strategy);

  // expressApp.use(passport.initialize());

  // Authentification middleware
  // const AuthentMiddleware = new AuthenticatorMiddleware();
  // expressApp.use('/api', (req, res, next) => {
  //   if (req.url === '/auth/login') {
  //     return next();
  //   }
  //   AuthentMiddleware.use(req, res, next);
  // });

};
