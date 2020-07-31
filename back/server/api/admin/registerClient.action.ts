import { ClientSchema }from '../../components/supplier/clientSchema';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/register',
    services: [''],
    handler: (req, res, app) => createClient(req, app.get('AdminRegistry')),
};

export function createClient(req, AdminRegistry) {

    if(!req.decoded || req.decoded.type !== 'ADMIN') {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    loggerT.verbose('Body to create Client', req.body);

    const creator = req.decoded;

    if(!req.body || !req.body.client) {
        const err = new Error(`Client data missing in body.`);
        err['statusCode'] = 400;
        throw err;
    }
    let data = req.body.client;
    // Validate schema with Joi
    ClientSchema.validate(req.body.client, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Requête invalide, veuillez vérifier votre requête. Error : ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = val;
    });
    
    loggerT.verbose('createClient data', data);
    return AdminRegistry.createClient(data, req.decoded)
        .then(result => {
            loggerT.verbose('createClient result', result);
            let response = {
                statusCode: 200,
                msg: 'Client successfully created.'
            };

            return response;
        })
        .catch(err => {
            throw err;
        })
    ;

}
