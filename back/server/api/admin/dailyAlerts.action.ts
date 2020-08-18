import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => sendClientAlerts(req, res, app.get('AdminRegistry')),
};

export function sendClientAlerts(req, res, AdminRegistry) {
    const data = req.body;
    let d = moment().format('DD-MM-YYYY');
    loggerT.info(`Sending alerts for date ${d}.`);

    if((!data.username || !data.password) || (data.username === "" || data.password === "")) {
        const err = new Error(`Invalid admin login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }
    if(!data.alertType) {
        const err = new Error(`No alert type provided.`);
        err['statusCode'] = 400;
        throw err;
    } else {
        data.alertType = data.alertType.toUpperCase();
    }


    return AdminRegistry.login(data.username, data.password)
        .then(result => {
            loggerT.verbose('[ADMIN] alerts result for admin loggin', result);
            if(result) {
                return AdminRegistry.sendClientAlerts(data.alertType)
                    .then(secondRes => {
                        return secondRes;
                    })
                    .catch(err => {
                        loggerT.verbose('Err  = ', err);
                        res.status(500).json({status: err.msg})
                        return err;
                    })
                ;
            } else {
                const err = new Error(`Invalid login credentials.`);
                err['statusCode'] = 400;
                throw err;
            }
        })
        .catch(err => {
            loggerT.verbose('[ADMIN] sendClientAlerts err', err);
        })
    ;

}
