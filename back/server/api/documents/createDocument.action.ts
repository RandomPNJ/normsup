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

    // Protect from no files
    let docs = req.files;
    loggerT.verbose('Creating document.');

    // loggerT.verbose('req', Object.keys(req.files));
    // loggerT.verbose('req originalname', req.files[0].originalname);
    // loggerT.verbose('req fieldname', req.files[0].fieldname);

    return DocumentsRegistry.createDocument(docs, req.decoded)
        .then(res => {
            // loggerT.verbose('Res  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: 'Veuillez choisir un autre nom de groupe.'})
            return err;
        })
    ;
}
