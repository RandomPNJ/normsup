import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => sendReminder(req, res, app.get('RemindersRegistry')),
};

export function sendReminder(req, res, SupplierRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    loggerT.verbose('[sendReminder] req params', req.params);
    
    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, supplier id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }
    let id = parseInt(req.params.id, 10);
    loggerT.verbose('Sending reminder to supplier with id :', req.params.id);

    return SupplierRegistry.sendReminder(id, req.decoded)
        .then(res => {
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: err.message})
            return err;
        })
    ;

}
