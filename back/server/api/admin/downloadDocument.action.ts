import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';

declare var loggerT: any;

export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => downloadDocument(req, res, app.get('AdminRegistry')),
};

export function downloadDocument(req, res, AdminRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    loggerT.verbose('Downloading document.');

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, supplier id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    return AdminRegistry.downloadDocument(req.decoded, req.params.id)
        .then(result => {
            if(result) {
                console.log('result for file', result);
                res.set({'Content-Type': 'application/pdf'});
                res.attachment('test-file-name.pdf');
                return res.send(result.Body);
            } else {
                return res.status(404).json({
                    msg: 'No picture found.'
                });
            }
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
