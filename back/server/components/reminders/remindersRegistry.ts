import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Query from './queries';
import config from '../../config/environment/index';
import {email2 as emailTemplate} from './email';

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
        let genericTemplate = _.template(emailTemplate);
        let mailOptions = {
            from: 'NormSup <mail.normsup@gmail.com>', // sender address
            to: '', // list of receivers
            subject: 'Relance : Dépôt de document sur NormSup', // Subject line
            html: 'Empty message. Failed.'
        };
        let rTitle = 'Monsieur/Madame';

        query['sql']    = Query.GET_SUPPLIER_INFO;
        query['values'] = [user.id, supplierID];
    
        return this.mysql.query(query)
            .then((res) => {
                loggerT.verbose('[sendReminder] QUERY RES ==== ', res);
                if(res && res[0] && res[0].email) {
                    mailOptions.to = res[0].email;
                    res[0].denomination = res[0].denomination ? ' ' + res[0].denomination.toUpperCase() : '';
                    if(res[0].gender === 'M') {
                        rTitle = 'Monsieur';
                    } else if(res[0].gender === 'F') {
                        rTitle = 'Madame';
                    }

                    mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(res[0].lastname), 'denomination': res[0].denomination });
                    return this.transporter.sendMail(mailOptions)
                        .then(res => {
                            loggerT.verbose('[sendReminder] Send mail res :', res);
                            query['sql'] = Query.UPDATE_SPONT_REMIND;
                            query['values'] = [moment().add(3, 'day').toDate(), supplierID];
                            return this.mysql.query(query)
                                .then(res => {
                                    return Promise.resolve(res);
                                })
                                .catch(err => {
                                    loggerT.error('[sendReminder] Error when updating organisation table with new spont reminder date.');
                                    return Promise.reject(err);
                                })
                            ;
                        })
                        .catch(err => {
                            loggerT.error('[sendReminder] ERROR ON QUERY sendMail.');
                            return Promise.reject(err);
                        })
                    ;
                }
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


        query['sql']    = Query.DAILY_REMINDERS;
        query['values'] = [new Date()];
    
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[sendDailyReminders] RES ==== ', res);
                if(res && res.length > 0) {
                    return this.sendMails2(res)
                        .then(() => {
                            loggerT.verbose('sendMails2 promise res', res);
                            let q = Query.UPDATE_REMINDERS;
                            let updateReminders = {
                                timeout: 40000,
                                sql: q,
                                values: [new Date(), new Date()]
                            };
                            let historicQuery = {
                                timeout: 40000,
                                sql: Query.UPDATE_REMIND_HISTORY,
                                values: []
                            };
                            let varray = [];
                            let failures = [];
                            res.forEach((supp, i) => {
                                if(i===0) {
                                    updateReminders.sql += ' gr.group_id = ?';
                                } else {
                                    updateReminders.sql += ' OR gr.group_id = ?';
                                }
                                loggerT.verbose('supp', supp);
                                supp.status = 'OK';
                                // To update the reminders table
                                updateReminders.values.push(supp.group_id);
                                // To create reminders history == client_id, group_id, status, supplier_id ==
                                if(supp.client_id) {
                                    varray.push([supp.client_id, supp.group_id, supp.status, supp.id]);
                                } else {
                                    failures.push([supp.client_id, supp.group_id, supp.status, supp.id]);
                                }
                            });
                            historicQuery.values.push(varray)
                            return this.allSkippingErrors([this.mysql.query(updateReminders), this.mysql.query(historicQuery)], 'sendDailyReminders')
                                .then(() => {
                                    return Promise.resolve({items: res});
                                })
                            ;
                        })
                        .catch(err => {
                            loggerT.verbose('sendMails2 promise err', err);
                        })
                    ;
                } else {
                    return Promise.reject({msg: '[sendDailyReminders] No groups to remind.'})
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY sendDailyReminders.');
                return Promise.reject(err);
            })
        ;
    }
    // Promise version of sendMails, maybe not useful ?
    private sendMails2(suppliers) {
        let genericTemplate = _.template(emailTemplate);
        let mailOptions = {
            from: 'NormSup <mail.normsup@gmail.com>', // sender address
            to: '', // list of receivers
            subject: 'Relance : Dépôt de document sur NormSup', // Subject line
            html: 'Empty message. Failed.'
        };
        /*
        let sesMailOptions = {
            from: 'yassin.elfahim@gmail.com', // sender address
            to: '', // list of receivers
            subject: '[NORMSUP] Relance du ' + moment().format('DD-MM-YYYY'), // Subject line
            // html: 'Empty message. Failed.'
            text: 'Empty message. Failed.'
        };
        */
        let mails = [];
        let name = '';
        let denom = '';
        suppliers.forEach(s => {
            let rTitle = 'Monsieur/Madame';
            if(s.denomination && s.email) {
                denom = s.denomination ? ' ' + s.denomination.toUpperCase() : '';
                if(s.gender === 'M') {
                    rTitle = 'Monsieur';
                } else if(s.gender === 'F') {
                    rTitle = 'Madame';
                }
                mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(s.represLastname), 'denomination': denom });
                mailOptions.to = s.email;
                mails.push(this.transporter.sendMail(mailOptions));
            } else {

            }
        });
        loggerT.verbose('sendMails2 here ');
        return Promise.all(mails);
    }

    private sendMails(suppliers) {
        let mailOptions = {
            from: 'NormSup <mail.normsup@gmail.com>', // sender address
            to: '', // list of receivers
            subject: 'Relance du ' + moment().format('DD-MM-YYYY'), // Subject line
            html: 'Empty message. Failed.'
        };
        let result = [];
        suppliers.forEach(s => {
            if(!s.email) {
                s.status = -1;
                return result.push(s);
            } else {
                mailOptions.html = '<h4>Test de relance pour la journée du ' + moment().format('DD-MM-YYYY') + '.<h4> \n\n\n <p>Pour le fournisseur : ' + s.denomination ? s.denomination : 'nameError' + '.</p>';
                mailOptions.to = s.email;
                return this.transporter.sendMail(mailOptions, 
                    (err, info) => {
                        if(err) {
                            loggerT.error(`[sendMails] Error happened when trying to reach supplier ${s.denomination} with error : ${err}`);
                            s.status = -1;
                            result.push(s);
                        } else {
                            loggerT.verbose(`[sendMails] Mail successfully sent to supplier ${s.denomination} with info : ${info}`);
                            s.status = 0;
                            result.push(s);
                        }
                    })
                ;
            }
        });
        return result;
    }

    // TODO
    public manageReminders() {

    }

    private allSkippingErrors(promises, fnc) {
        let errs = [];
        return Promise.all(
          promises.map(p => p.catch(error => {
              loggerT.error('[allSkippingErrors] ERROR on function ', fnc, 'with error :', error);
              errs.push(error)
            }))
        )
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
