import { SupplierSchema }from '../../components/supplier/supplierSchema';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_supplier',
    services: [''],
    handler: (req, res, app) => sendDailyReminders(req, res, app.get('AdminRegistry'), app.get('RemindersRegistry')),
};

export function sendDailyReminders(req, res, AdminRegistry, RemindersRegistry) {
    const user = req.body;
    let d = moment().format('DD-MM-YYYY');
    loggerT.info(`Sending daily reminder for date ${d}.`);

    if((!user.username || !user.password) || (user.username === "" || user.password === "")) {
        const err = new Error(`Invalid login credentials.`);
        err['statusCode'] = 400;
        throw err;
    }

    return AdminRegistry.login(user.username, user.password)
        .then(result => {
            loggerT.verbose('result for admin loggin', result);
            if(result) {
                return RemindersRegistry.sendDailyReminders()
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
            loggerT.verbose('sendDailyReminders err', err);
        })
    ;

}
