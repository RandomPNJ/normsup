import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid/v4';

// const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class UserRegistry {

    private mysql: any;
    private refreshTokens: any;
    private s3: any;
    public constructor(mysql, s3Client) {
        this.mysql = mysql;
        this.s3 = s3Client;
        this.refreshTokens = {};
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

    public refreshToken(login) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('login = ', login)
        query['sql']    = Query.FIND_USER_BY_NAME_EMAIL;
        query['values'] = [login, login];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({statusCode: 404, msg: 'User not found.'});
                }
                let user = res[0];
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
            })
            .catch(err => {
                return Promise.reject({statusCode: 404, msg: err.msg});
            })
        ;
    }
    public genToken(payload) {
        let token = jwt.sign(payload, config.secret, { expiresIn: config.jwt.expirationTime });
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
                loggerT.verbose('[getUser] QUERY RES ==== ', res);
                if(res && res[0] && res[0].id) {
                    query['sql'] = Query.GET_USER_ROLES;
                    query['values'] = [id];
                    let user = res[0];
                    return this.mysql.query(query)
                        .then(res => {
                            loggerT.verbose('[getUser] QUERY2 RES ==== ', res);
                            let data = [];
                            if(res.length > 0 ) {
                                res.length.forEach(e => {
                                    data.push(e.name);
                                });
                            }
                            user.roles = data;
                            return Promise.resolve(user);

                        })
                        .catch(err => {
                            err.message = 'Error when getting user roles';
                            return Promise.reject(err);
                        })
                    ;
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                err.message = 'Error when getting user';
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

    public modifyPassword(id, login, data) {
        let query = {
            timeout: 40000
        };
        const that = this;
        query['sql']    = Query.FIND_USER_BY_NAME_EMAIL;
        query['values'] = [login, login];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({statusCode: 404, msg: 'User not found.'});
                }
                loggerT.verbose('res user', res[0]);
                let user = res[0];
                return bcrypt.compare(data.password, user.password)
                    .then(res => {
                        if(res === true) {
                            loggerT.verbose('bcrypt true');
                            return bcrypt.hash(data.newpassword, 14, function(err, hash) {
                                loggerT.verbose('bcrypt hash', hash);
                                if(err) {
                                    return Promise.reject({statusCode: 500, msg: 'Could not change password.'});
                                }
                                loggerT.verbose('bcrypt hash', hash);
                                query['sql']    = Query.QUERY_MODIFY_PASSWORD;
                                query['values'] = [hash, id];
                                return that.mysql.query(query)
                                   .then(res => {
                                       loggerT.verbose('QUERY RES on modified password ==== ', res);
                                       return Promise.resolve(res);
                                   })
                                   .catch(err => {
                                       loggerT.error('ERROR ON QUERY modifyPassword.');
                                       return Promise.reject(err);
                                   })
                               ;
                            });
                        }
                        loggerT.verbose('bcrypt true');
                        return Promise.reject({statusCode: 400, msg: 'Wrong credentials.'});
                    }
                );
            })
            .catch(err => {
                return Promise.reject({statusCode: err.statusCode, msg: err.msg});
            })
        ;


    }

    public createUser(data, user) {
        let query = {
            timeout: 40000
        };
        const that = this;
        query['sql']    = Query.INSERT_USER;
        query['values'] = [data.name, data.lastname, data.email, data.password, data.username, user.organisation, user.organisation, data.create_time, user.id];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY createUser RES ==== ', res);
                const roleID = that.getRoleID(data.role);

                query['sql']    = Query.INSERT_ROLE;
                query['values'] = [res.insertId, roleID];
                

                return that.mysql.query(query)
                    .then(res => {
                        loggerT.verbose('QUERY createRole RES ==== ', res);
                        return Promise.resolve(res);
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

    public uploadPicture(file, user) {
        let query = {
            timeout: 40000
        };
        let name = uuid();
        let path = 'PROFILEPIC/' + name;

        query['sql']    = Query.UPDATE_PROFILE_PIC;
        query['values'] = [path, user.id];
        

        return this.uploadFile(file, path)
            .then(() => {
                return this.mysql.query(query)
                    .then(res => {
                        loggerT.verbose('QUERY RES ==== ', res);
                        return Promise.resolve(res);
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY updateProfilePic.');
                        return Promise.reject(err);
                    })
                ;
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY uploadFile.');
                return Promise.reject(err);
            })
        ;
    }

    private uploadFile(file, key) {

        return this.s3.upload({
            Bucket: 'normsup',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }).promise()
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


    public getPicture(id) {
        return this.runQuery('FIND_USER_BY_ID', [id])
            .then((res) => {
                // loggerT.verbose('User res', res);
                if(res && res[0] && res[0].picture_url) {
                    return this.getPictureFromDB(res[0].picture_url);
                }
            });
    }


    private getPictureFromDB(path) {
        return this.s3.getObject({
            Bucket: 'normsup',
            Key: path
        }).promise()
        ;
    }

    public runQuery(queryType, params) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query[queryType];
        query['values'] = params;

        return this.mysql.query(query, params);
    }

    // MIGHT CREATE MEMORY OVERLOAD ???????
    public setRefreshToken(uuid, username) {
        return this.refreshTokens[uuid] = username;
    }

    public deleteRefreshToken(uuid) {
        if(this.refreshTokens[uuid])
            delete this.refreshTokens[uuid];
    }

    public getUsernameFromRefreshTok(uuid) {
        if(this.refreshTokens[uuid])
            return this.refreshTokens[uuid];
    }

    public getAllRefreshTokens() {
        return this.refreshTokens;
    }

    public getUserFromDB(userID) {
        
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
