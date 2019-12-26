import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => getDocuments(req, res, app.get('DocumentsRegistry')),
};

export function getDocuments(req, res, DocumentsRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    const params = req.query;
    loggerT.verbose('Getting the documents.');

    if(!params.company) {
        const error = new Error(`Invalid request, error message: company not provided.`);
        error['statusCode'] = 400;
        throw error;
    }

    let data = {
        company: params.company,
        groups: [],
        suppliers: []
    };

    if(params.groups) {
        data['groups'] = params.groups;
    }
    if(params.suppliers) {
        data['suppliers'] = params.suppliers;
    }

    return DocumentsRegistry.getDocuments(data)
        .then(res => {
            let result = {
                items: res
            };
            return result;
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
