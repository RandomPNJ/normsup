import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';
import { createReadStream } from 'fs';
import { Readable, Stream } from 'stream';
import * as archiver from 'archiver';
import * as s3Zip from 's3-zip';

declare var loggerT: any;


export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => validate(req, res, app.get('AdminRegistry')),
};

export function validate(req, res, AdminRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('Document validation.');

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }
    
    let id 
    let data = req.body;

    if(!data.item || !data.item.validityDate || !data.item.siren) {
        const error = new Error(`Invalid request, please provide item property.`);
        error['statusCode'] = 400;
        throw error;
    }

    if(!data.hasOwnProperty('validated') || typeof data.validated !== 'boolean') {
        const error = new Error(`Invalid request, please provide validated property.`);
        error['statusCode'] = 400;
        throw error;
    }

    loggerT.verbose('Data after :', data);
    return AdminRegistry.validate(req.params.id, data.item, data.validated)
        .then(result => {
            if(result) {
                return {
                    status: 1,
                    msg: 'Success'
                };
            } else {
                const error = new Error(`No document found.`);
                error['statusCode'] = 404;
                throw error;
            }
        })
        .catch(err => {
            loggerT.error('ERROR CATCH ', err);
            delete err.stackTrace;
            throw err;
        })
    ;
}
