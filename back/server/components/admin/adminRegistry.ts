import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';

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
