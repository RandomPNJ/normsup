import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class UserRegistry {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public login(login: string, password: string) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.FIND_USER_BY_NAME_EMAIL;
        query['values'] = [login, login];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({statusCode: 404, msg: 'User not found.'});
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
                                organisation: user.organisation,
                                client: user.client,
                                role: user.role,
                                createTime: new Date(user.create_time)
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

    public genToken(payload) {
        let token = jwt.sign(payload, config.secret, { expiresIn: 36000 });
        return token;
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
            query['values'] = [data.org];
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


    public getUser(id) {
        let query = {
            timeout: 40000
        };

        if(id) {
            query['sql']    = Query.QUERY_GET_USER;
            query['values'] = [id];
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

    public modifyUser(id, userInfo) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('userInfo', userInfo);
        loggerT.verbose('userInfo.email', userInfo.email);
        query['sql']    = Query.QUERY_MODIFY_USER;
        query['values'] = [userInfo.email, userInfo.lastname, userInfo.name, userInfo.address, userInfo.phonenumber, userInfo.postalCode, userInfo.city, id];

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

    public createUser(data) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.INSERT_USER;
        query['values'] = [data];
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY createUser : ', err);
                return Promise.reject(err);
            })
        ;
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
