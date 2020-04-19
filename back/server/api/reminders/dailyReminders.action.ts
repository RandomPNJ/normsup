import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => sendDailyReminders(req, res, app.get('RemindersRegistry')),
};

export function sendDailyReminders(req, res, RemindersRegistry) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    return RemindersRegistry.sendDailyReminders(req.decoded)
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
