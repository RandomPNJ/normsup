import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import * as SupplierQuery from '../supplier/queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

declare var loggerT: any;

export default class AdminRegistry {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public login(login: string, password: string) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.FIND_ADMIN_BY_NAME_EMAIL;
        query['values'] = [login, login];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({statusCode: 404, msg: 'NormSup admin user not found.'});
                }
                let user = res[0];
                return bcrypt.compare(password, user.password)
                .then(res => {
                        if(res === true) {
                            const payload = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                name: user.name,
                                lastname: user.lastname,
                                createTime: new Date(user.create_time),
                            };
                            return Promise.resolve(payload);
                        }
                        return Promise.reject({statusCode: 400, msg: 'Wrong credentials.'});
                    }
                );
            })
            .catch(err => {
                return Promise.reject({statusCode: 404, msg: err.msg});
            })
        ;
    }

    public createUser(data, user) {
        let query = {
            timeout: 40000
        };
        const that = this;
        query['sql']    = Query.INSERT_USER;
        query['values'] = [data.name, data.lastname, data.email, data.password, data.username, data.organisation, data.create_time, user.id];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY createUser RES ==== ', res);
                const roleID = that.getRoleID(data.role);

                query['sql']    = Query.INSERT_ROLE;
                query['values'] = [res.insertId, roleID];
                

                return that.mysql.query(query)
                    .then(res => {
                        loggerT.verbose('QUERY createRole RES ==== ', res);
                        query['sql'] = Query.INSERT_USER_PREFERENCES;
                        query['values'] = [res.insertId];
                        return that.mysql.query(query)
                            .then(() => {
                                return Promise.resolve(res);
                            })
                            .catch(err => {
                                loggerT.error('QUERY INSERT_USER_PREFERENCES ERR ==== ', err);
                                return Promise.reject({statusCode: 500, msg: 'Could not create user preferences for user with id :' + res.insertId})
                            })
                    })
                    .catch(err => {
                        loggerT.error('QUERY createRole ERR ==== ', err);
                        return Promise.reject({statusCode: 500, msg: 'Could not create user role for user with id :' + res.insertId})
                    })
                ;

            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY createUser : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public createAdmin(data) {
        let query = {
            timeout: 40000
        };
    
        query['sql']    = Query.INSERT_ADMIN;
        query['values'] = [data.name, data.lastname, data.email, data.password, data.username];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[ADMIN] QUERY createAdmin RES ==== ', res);
                

                return Promise.resolve(res);

            })
            .catch(err => {
                loggerT.error('[ADMIN] ERROR ON QUERY createAdmin : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public createClient(data) {
        let query = {
            timeout: 40000
        };
        // org_name, address, postalCode, city, country
        query['sql']    = Query.INSERT_CLIENT;
        query['values'] = [data.org_name, data.address, data.postalCode, data.city, data.country];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[ADMIN] QUERY createAdmin RES ==== ', res);
                

                return Promise.resolve(res);

            })
            .catch(err => {
                loggerT.error('[ADMIN] ERROR ON QUERY createAdmin : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public conformityCheckup() {
        let query = {
            timeout: 40000
        };
        let date = moment().startOf('month').toDate();
        let now = moment();
        query['sql']    = Query.GET_MONTHLY_CONFORMITY;
        query['values'] = [date];
        let toModify = [];
        let toPush = false;
        let confArray = []
        let subQuery = {
            timeout: 40000,
            values: [],
            sql: Query.UPDATE_SUPPLIER_CONFORMITY
        };
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[ADMIN] QUERY conformityCheckup RES ==== ', res);
                if(res && res.length > 0) {
                    res.forEach(e => {
                        toPush = false;
                        if(e.kbis === 1) {
                            if(e.kbis_expiration && now.isAfter(moment(e.kbis_expiration))) {
                                toPush = true;
                                e.kbis = 0;
                                e.kbis_expiration = null;
                            } else if(!e.kbis_expiration) {
                                toPush = true;
                                e.kbis = 0;
                            }
                        }
                        if(e.lnte === 1) {
                            if(e.lnte_expiration && now.isAfter(moment(e.lnte_expiration))) {
                                toPush = true;
                                e.lnte = 0;
                                e.lnte_expiration = null;
                            } else if(!e.lnte_expiration) {
                                toPush = true;
                                e.lnte = 0;
                            }
                        }
                        if(e.urssaf === 1) {
                            if(e.urssaf_expiration && now.isAfter(moment(e.urssaf_expiration))) {
                                toPush = true;
                                e.urssaf = 0;
                                e.urssaf_expiration = null;
                            } else if(!e.urssaf_expiration) {
                                toPush = true;
                                e.urssaf = 0;
                            }
                        }
                        if(toPush) {
                            let z = _.cloneDeep(subQuery);
                            z.values = [e.kbis,e.lnte,e.urssaf,e.kbis_expiration,e.urssaf_expiration,e.lnte_expiration,e.supplier_id,e.client_id,date];
                            toModify.push(this.mysql.query(z));
                        }
                    });

                    const promises = toModify.map(p => p.catch(e => e)); 
                      
                    return Promise.all(promises)
                        .then(result => {
                            loggerT.verbose('Final res conformityCheckup : ', result)
                            let errors = [];
                            if(result) {
                                result.forEach((r, i) => {
                                    if(r.hasOwnProperty('errno')) {
                                        errors.push(res[i]);
                                    }
                                });
                                loggerT.verbose('Errors when trying to conformityCheckup : ', errors);
                            }
                        })
                        .catch(err => {
                            loggerT.error('Final err conformityCheckup : ', err)
                        })
                    ;
                }

                return Promise.resolve(res);

            })
            .catch(err => {
                loggerT.error('[ADMIN] ERROR ON QUERY conformityCheckup : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public sendClientAlerts(type) {
        let query = {
            timeout: 40000
        };
        let mailQuery = {
            timeout: 40000,
            sql: '',
            values: []
        };
        let q;
        let queryEnd;
        let mailData = {};
        if(type === 'NORMAL') {
            q = Query.GET_ALERTS_CLIENTS;
            let weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            //                      TO DECOMMENT
            // let day = weekday[(new Date()).getDay()];
            //                      TO REMOVE
            let day = 'Monday';
            if(day === 'Sunday' || day === 'Saturday') {
                return Promise.reject('Not a weekday.');
            }
            queryEnd = this.getAlertType(day);
            q += queryEnd;
        } else if(type === 'BIMONTHLY') {
            q = Query.GET_ALERTS_BIMONTHLY;
            q += " AND cp.alert_frequency = 'BIMONTHLY' ";
        } else if(type === 'MONTHLY') {
            q = Query.GET_ALERTS_MONTHLY;
            q += " AND cp.alert_frequency = 'MONTHLY' ";
        }
    
        
        
        query['sql']    = q;
        query['values'] = [];
        let dataQuery = {
            timeout: 40000, 
            values: []
        };
        dataQuery['sql']    = Query.ALERT_MAIL_DATA;
        let allValues = [];
        let clientIdsDone = {};
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[ADMIN] QUERY dailyAlerts RES ==== ', res);
                if(res && res.length > 0) {
                    let id;
                    res.forEach((u, i) => {
                        id = u.client_id;
                        if(!clientIdsDone[id]) {
                            clientIdsDone[id] = 'empty';
                            let a = _.cloneDeep(dataQuery);
                            a.values = [u.client_id, u.client_id, u.client_id, moment().startOf('month').toDate()];
                            allValues[i] = this.mysql.query(a);
                        }
                    });
                    return Promise.all(allValues.map(p => p.catch(e => e)))
                        .then(resultData => {
                            loggerT.verbose('ADMIN] QUERY gettingData for clients', resultData);
                            resultData.forEach((data, e) => {
                                if(data[0]) {
                                    clientIdsDone[data[0].client_id] = data[0];
                                }
                            });
                            loggerT.verbose('ADMIN] QUERY clientIdsDone', clientIdsDone);
                        })
                        .catch(errorData => {
                            loggerT.error('ADMIN] ERROR ON QUERY gettingData for clients', errorData);
                        })
                    ;
                }

                return Promise.resolve(res);

            })
            .catch(err => {
                loggerT.error('[ADMIN] ERROR ON QUERY dailyAlerts : ', err);
                return Promise.reject(err);
            })
        ;
    }
    
    private getAlertType(day) {
        let res = '';
        if(day === 'Monday') {
            res = " AND (cp.alert_frequency = 'EVERYOTHERDAY' OR cp.alert_frequency = 'WEEKLY' OR cp.alert_frequency = 'DAILY')"
        } else if(day === 'Wednesday' || day === 'Friday') {
            res = " AND (cp.alert_frequency = 'EVERYOTHERDAY' OR cp.alert_frequency = 'DAILY')"
        } else {
            res = " AND cp.alert_frequency = 'DAILY' ";
        }
        return res;
    }

    public getUsers(data) {
        let query = {
            timeout: 40000
        };

        if(data.start) {
            query['sql']    = Query.QUERY_GET_USERS_OFFLIM;
            query['values'] = [data.company, data.limit, data.start];
        } else {
            query['sql'] = Query.QUERY_GET_USERS;
            query['values'] = [];
        }
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                return Promise.reject(err);
            })
        ;
    }

    public getSuppliersUsers(data) {
        let query = {
            timeout: 40000
        };

        if(data.start) {
            query['sql']    = Query.QUERY_GET_SUPPLIERS_USERS_OFFLIM;
            query['values'] = [parseInt(data.length, 10), parseInt(data.start, 10)];
        } else {
            query['sql'] = Query.QUERY_GET_SUPPLIERS_USERS;
            query['values'] = [];
        }

        loggerT.verbose('sql = ', query['sql']);
        loggerT.verbose('values = ', query['values']);
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('[ADMIN] ERROR ON QUERY getSuppliersUsers : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public getClients(data) {
        let query = {
            timeout: 40000
        };
        Object.keys(data).forEach(k => loggerT.verbose('[getClients] data : ', data[k]))
        // loggerT.verbose('[getClients] data', data);
        if(data !== '') {
            query['sql'] = Query.QUERY_GET_CLIENTS;
            data += '%'
            query['values'] = [data];
        } else if(data === ''){
            query['sql'] = Query.QUERY_GET_ALL_CLIENTS;
            query['values'] = [];
        }

        loggerT.verbose('[getClients] query', query['sql']);

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                return Promise.reject(err);
            })
        ;
    }

    public getSuppliers(data) {
        let query = {
            timeout: 40000
        };

        if(data.search) {
            data.search += '%'
        } else {
            data.search = '%'
        }

        if(data.clientID) {
            query['sql'] = Query.GET_SUPPLIERS_CLIENTID;
            query['values'] = [data.clientID, data.search, data.search];
        } else {
            query['sql'] = Query.GET_SUPPLIERS;
            query['values'] = [data.search, data.search];
        }

        loggerT.verbose('query["sql"]', query['sql'])
        loggerT.verbose('query["values"]', query['values'])

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                return Promise.reject(err);
            })
        ;
    }

    public getAdmin(id, email) {
        let query = {
            timeout: 40000
        };

        query['sql'] = Query.QUERY_GET_ADMIN;
        query['values'] = [id, email];
        
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                if(res && res[0]) {
                    let admin = res[0];
                    if(admin.password) delete admin.password;
                    return Promise.resolve(res[0]);
                } else {
                    return Promise.reject(new Error('No admin found.'));
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                return Promise.reject(err);
            })
        ;
    }
    private getRoleID(role) {
        if(role === 'admin') {
            return 1;
        } else if(role === 'user') {
            return 2;
        } else if(role === 'guest') {
            return 3;
        }
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
