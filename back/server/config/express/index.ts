  /**
 * Express config
 * 1.0.2
 */

import * as helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';

import { indexOf } from 'lodash';
// import {useExpressServer, useContainer} from 'routing-controllers';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import config from '../environment';
import * as UserLogin from '../../api/auth/login.action';
import {AuthenticatorMiddleware} from './auth-middleware';

declare var loggerT: any;
declare var loggerIO: any;

const methodOverride = require('method-override');
const moment = require('moment');
const cookieParser = require('cookie-parser');

const secret = config.secret;

export default (expressApp) => {

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  expressApp.use(helmet());
  expressApp.use(compression());
  expressApp.use(cookieParser());
  expressApp.use(bodyParser.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000}));
  expressApp.use(bodyParser.json({ limit: '50mb' }));
  expressApp.use(methodOverride());
  let origin;
  let accessControlAllowOrigin = '*';
  const allowedOrigins = ['http://localhost:4200', 'app.normsup.com'];

  // Disable caching
  expressApp.use(helmet.noCache());
  expressApp.disable('etag');

  // Configuration serveur (CORS)
  expressApp.use('/', (req, res, next) => {
    origin = req.get('origin');
    if(origin && indexOf(allowedOrigins, origin) !== -1 ) {
      accessControlAllowOrigin = origin;
    } else {
      accessControlAllowOrigin = '*';
    }
    res.header('Access-Control-Allow-Origin', accessControlAllowOrigin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
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
    // loggerT.verbose('Req cookies ==', req.cookies.auth);
    next();
  });

  let ExtractJwt = passportJWT.ExtractJwt;
  let JwtStrategy = passportJWT.Strategy;
  let jwtOptions = {};
  jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions['secretOrKey'] = secret;

  // lets create our strategy for web token
  let strategy = new JwtStrategy(jwtOptions, 
    (jwtPayload, next) => {
    if (Date.now() > jwtPayload.expires) {
      return next('jwt expired');
    }
    return next(null, jwtPayload);
  });

  // use the strategy
  passport.use(strategy);
  expressApp.use(passport.initialize());

  // Authentification middleware
  const AuthMiddleware = new AuthenticatorMiddleware();
  expressApp.use('/api', (req, res, next) => {
    if(req.url === '/auth/login' || req.url === '/auth/refresh_token' || req.url === '/auth/supplier-login') {
      return next();
    }
    AuthMiddleware.use(req, res, next);
  });

  // Multer to upload files
  expressApp.use('/api/documents/upload', upload.array('files', 3));
  expressApp.use('/api/users/upload', upload.single('file'));

};
