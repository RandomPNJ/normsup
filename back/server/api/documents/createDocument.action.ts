import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import * as pdfparser from 'pdf2json';
import * as _ from 'lodash';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/upload',
    services: [''],
    handler: (req, res, app) => createDocument(req, res, app.get('DocumentsRegistry')),
};

export function createDocument(req, res, DocumentsRegistry) {
    if (!req.decoded && req.decoded.type === 'SUPPLIER') {
        return Promise.reject(`Cannot get user informations or user is not a supplier.`);
    }

    loggerT.verbose('Creating document.');

    loggerT.verbose('Creating document USER :', req.decoded);

    let docs = req.files;

    return DocumentsRegistry.createDocument(docs, req.decoded)
        .then(res => {
            loggerT.verbose('FINAL RES  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: 'Veuillez choisir un autre nom de groupe.'})
            return err;
        })
    ;
}
