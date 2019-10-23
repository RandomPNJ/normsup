import { cloneDeep } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/upload',
    services: [''],
    handler: (req, res, app) => createDocument(req, res, app.get('DocumentsRegistry')),
};

export function createDocument(req, res, DocumentsRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    let params;
    let doc = req.file;
    let metadata = req.body
    loggerT.verbose('Creating document.');

    return DocumentsRegistry.createDocument(doc, metadata, req.decoded)
        .then(res => {
            loggerT.verbose('Res  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: 'Veuillez choisir un autre nom de groupe.'})
            return err;
        })
    ;
}
