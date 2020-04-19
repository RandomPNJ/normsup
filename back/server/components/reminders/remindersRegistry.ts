import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Query from './queries';
import config from '../../config/environment/index';

declare var loggerT: any;

export default class RemindersRegistry {

    private mysql: any;
    private transporter: any;

    public constructor(mysql, mailer) {
        this.mysql = mysql;
        this.transporter = mailer;
    }


    public getReminders() {

    }

    // TODO
    public sendReminder(supplierID, user) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.GET_SUPPLIER_INFO;
        query['values'] = [user.id, supplierID];
    
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    // TODO
    public sendGroupReminder(groupID, user) {
        let query = {
            timeout: 40000
        };


        query['sql']    = Query.GROUP_TO_REMIND;
        query['values'] = [groupID, user.organisation];
    
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[sendGroupReminder] RES ==== ', res);
                if(res && res.length > 0) {
                    return this.sendMails(res);

                } else {
                    return Promise.reject({msg: 'No result'})
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    public sendDailyReminders() {
        let query = {
            timeout: 40000
        };


        query['sql']    = Query.GROUPS_TO_REMIND;
        query['values'] = [moment().date()];
    
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[sendGroupReminder] RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    private sendMails(suppliers) {
        let normsupAdmins = [
            {
                email: 'yassin.elfahim@gmail.com',
                denomination: 'AXA'
            },
            {
                email: 'william.tadjou@normsup.com',
                denomination: 'NormSup'
            },
            {
                email: 'jeremy.daure@normsup.com',
                denomination: 'NormSup'
            },
        ]
        let all = normsupAdmins.concat(suppliers);
        let mailOptions = {
            from: 'normsup@gmail.com', // sender address
            to: '', // list of receivers
            subject: '[NORMSUP] Relance du ' + moment().format('DD-MM-YYYY'), // Subject line
            html: 'Empty message. Failed.'
        };
        let failed = [];
        suppliers.forEach(s => {
            if(!s.email) {
                return failed.push(s);
            } else {
                mailOptions.html = '<h4>Test de relance pour la journée du ' + moment().format('DD-MM-YYYY') + '.<h4> \n\n\n <p>Pour le fournisseur : ' + s.denomination ? s.denomination : 'nameError' + '.</p>';
                mailOptions.to = s.email;
                return this.transporter.sendMail(mailOptions, 
                    (err, info) => {
                        if(err) {
                            loggerT.error(`[sendMails] Error happened when trying to reach supplier ${s.denomination} with error : ${err}`);
                        } else {
                            loggerT.verbose(`[sendMails] Mail successfully sent to supplier ${s.denomination} with info : ${info}`);
                        }
                    })
                ;
            }
        });
    }

    // TODO
    public manageReminders() {

    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
