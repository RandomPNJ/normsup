import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => sendGroupReminder(req, res, app.get('RemindersRegistry')),
};

export function sendGroupReminder(req, res, RemindersRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    
    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, group id must be specified.`);
        error['statusCode'] = 400;
        throw error;
    }

    let id = parseInt(req.params.id, 10);
    loggerT.verbose(`Sending reminder to group with id : ${req.params.id}`);
    loggerT.verbose('Req decoded =', req.decoded);

    return RemindersRegistry.sendGroupReminder(id, req.decoded)
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
