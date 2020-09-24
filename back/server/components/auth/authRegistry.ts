import { Promise } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';
import * as Query from './query';
import * as mail from './email';

declare var loggerT: any;

export default class AuthRegistry {

    private mysql: any;
    private transporter: any;

    public constructor(mysql?, transporter?) {
        this.mysql = mysql;
        this.transporter = transporter;
    }

    public validateToken(token: any): any {
        const res = {
            code: null,
            msg: null,
            token: null
        };
        if (!token) {
            res.code = 401;
            res.msg = "No token provided.";
            res.token = null
            return Promise.resolve(res);
        }

        return new Promise<any>((resolve) => {
            jwt.verify(token, this.getSecret(), (err: any, decoded: any) => {
                if(err) {
                    resolve({
                        code: 403,
                        msg: "Failed to authenticate token. (" + err.message + ")",
                        originalMessage: err.message,
                        token: null
                    });
                }

                resolve({
                    code: 200,
                    msg: "Successfully decoded",
                    token: decoded
                });
            });
        });
    }


    public resetPassword(email) {
        let q = {
            timeout: 40000,
            sql: Query.CHECK_EMAIL_EXIST,
            values: [email]
        };

        return this.mysql.query(q)
            .then(res => {

                if(res && res[0]) {
                    let data = res[0];
                    let token = uuid();

                    loggerT.verbose('[AuthRegistry] resetPassword res', res[0])
                    q.sql = Query.INSERT_RESET_PASSWORD;
                    q.values = [data.id, 'CLIENT', token]
                    return this.mysql.query(q)  
                        .then(res => {
                            let genericTemplate = _.template(mail.resetPwdMail);
                            let mailOptions = {
                                from: 'NormSup <mail.normsup@gmail.com>', // sender address
                                to: '', // list of receivers
                                subject: 'NormSup: Réinitialisation de mot de passe', // Subject line
                                html: 'Empty message. Failed.'
                            };
        
                            let denom = '';
                            let rTitle = 'Monsieur/Madame';
                            denom = data.denomination ? ' ' + data.denomination.toUpperCase() : '';
                            if(data.gender && data.gender === 'M') {
                                rTitle = 'Monsieur';
                            } else if(data.gender && data.gender === 'F') {
                                rTitle = 'Madame';
                            }
                            
                            let link = 'https://app.normsup.com/supplier/reset_password;type=CLIENT;token='+token;
                            mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'link': link });
                            mailOptions.to = data.email;
                            return this.transporter.sendMail(mailOptions)
                                .then(() => {
                                    return Promise.resolve(res);
                                })
                                .catch(err => {
                                    return Promise.reject({msg: ''})
                                })
                            ;
                        })
                        .catch(err => {
                            return Promise.reject({msg: ''})
                        })
                    ;



                }
            })
            .catch(err => {
                return Promise.reject(err)
            })
        ;
    }

    public activateAccount(token) {

        let q0 = {
            timeout: 40000,
            sql: Query.CHECK_ACTIVATION,
            values: [token]
        }
        let q = {
            timeout: 40000,
            sql: Query.ACTIVATE_ACCOUNT,
            values: [moment().toDate(), token]
        };
        return this.mysql.query(q0)
            .then(acc_token => {
                loggerT.verbose('[AuthRegistry] res on activateAccount ', acc_token)
                if(acc_token && acc_token[0]) {
                    if(acc_token[0].activated) {
                        return Promise.reject({statusCode: 400, msg: 'Account already activated', code: 1});
                    } else if(moment(acc_token[0].expiration_time).isBefore(moment())) {
                        return Promise.reject({statusCode: 400, msg: 'Account validation has expired', code: 2});
                    } else {
                        return this.mysql.query(q)
                            .then(res => {
                                loggerT.verbose('[AuthRegistry] res on activateAccount ', res)
                                if(res && res.changedRows && res.changedRows === 1) {
                                    loggerT.verbose('[AuthRegistry] resetPassword activateAccount', res[0])
                                    return Promise.resolve({validated: true});
                                } else {
                                    return Promise.reject({statusCode: 400, msg: 'Account validation failed.', code: -1})
                                }
                            })
                            .catch(err => {
                                return Promise.reject(err)
                            })
                        ;
                    }
                } else {
                    return Promise.reject({statusCode: 400, msg: 'Token invalid.', code: 3});
                }
            })
            .catch(err => {
                return Promise.reject(err)
            })
        ;
        
    }

    public generateActivationLink(email) {

        let q0 = {
            timeout: 40000,
            sql: Query.CHECK_GENERATION,
            values: [email]
        };
        
        return this.mysql.query(q0)
            .then(acc_token => {
                loggerT.verbose('[AuthRegistry] res on generateActivationLink ', acc_token)
                if(acc_token && acc_token[0]) {
                    if(acc_token[0].activated) {
                        return Promise.reject({statusCode: 400, msg: 'Account already activated', code: 1});
                    } else {
                        let token = uuid();
                        loggerT.verbose('NEW TOKEN =', token);
                        let q = {
                            timeout: 40000,
                            sql: Query.RESET_ACTIVATION_EXPIRATION,
                            values: [moment().add(7, 'days').toDate(), token, acc_token[0].user_id]
                        };
                        return this.mysql.query(q)
                            .then(res => {
                                loggerT.verbose('RESET_ACTIVATION_EXPIRATION res = ', res)
                                let genericTemplate = _.template(mail.activationMail);
                                let mailOptions = {
                                    from: 'NormSup <mail.normsup@gmail.com>', // sender address
                                    to: '', // list of receivers
                                    subject: 'NormSup: Activation de compte fournisseur', // Subject line
                                    html: 'Empty message. Failed.'
                                };
                                let data = acc_token[0];
                                let denom = '';
                                let rTitle = 'Monsieur/Madame';
                                denom = data.denomination ? ' ' + data.denomination.toUpperCase() : '';
                                if(data.gender && data.gender === 'M') {
                                    rTitle = 'Monsieur';
                                } else if(data.gender && data.gender === 'F') {
                                    rTitle = 'Madame';
                                }
                                
                                let link = 'https://app.normsup.com/supplier/activation;activationToken='+token;
                                // mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'client_name': client.denomination, 'denomination': denom, 'login': data.email, 'password': password });
                                mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'link': link });
                                mailOptions.to = data.email;
                                return this.transporter.sendMail(mailOptions)
                                    .then(() => {
                                        return Promise.resolve(res);
                                    })
                                    .catch(err => {
                                        return Promise.reject({msg: 'Couldn\'t send mail to supplier\'s representative.'})
                                    })
                                ;
                            })
                            .catch(err => {
                                return Promise.reject(err)
                            })
                        ;
                    }
                } else {
                    return Promise.reject({statusCode: 400, msg: 'email.', code: 3});
                }
            })
            .catch(err => {
                return Promise.reject(err)
            })
        ;
        
    }

    public getSecret() {
        return config.secret;
    }
    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
