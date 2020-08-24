import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid/v4';
import {email as emailTemplate} from './email';

// const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class UserRegistry {

    private mysql: any;
    private refreshTokens: any;
    private s3: any;
    private transporter: any;

    public constructor(mysql, s3Client, mailer) {
        this.mysql = mysql;
        this.s3 = s3Client;
        this.refreshTokens = {};
        this.transporter = mailer;
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
                loggerT.verbose('[login] User data :', user);

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
                                role: [user.rolename],
                                createTime: new Date(user.create_time),
                                companyName: user.companyName
                            };
                            return Promise.resolve(payload);
                        }
                        return Promise.reject({statusCode: 400, msg: 'Wrong credentials.'});
                    }
                );
            })
            .catch(err => {
                loggerT.error('[login] ERROR ON QUERY login :', err);
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
                    createTime: new Date(user.create_time),
                    companyName: user.companyName
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


    public getUser(id, email?) {
        let query = {
            timeout: 40000
        };

        loggerT.verbose('[getUser] id =',id, ' email=', email);
        if(id) {
            if(email) {
                loggerT.verbose('[getUser] if one');
                query['sql']    = Query.GET_CURRENT_USER_EMAIL;
                let s = email ? '%'+email+'%' : '%';
                query['values'] = [id, email];
            } else {
                loggerT.verbose('[getUser] if two');
                query['sql']    = Query.QUERY_GET_USER;
                query['values'] = [id];
            }
        }
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[getUser] QUERY RES ==== ', res);
                if(res && res[0] && res[0].id) {
                    query['sql'] = Query.GET_USER_ROLES;
                    query['values'] = [res[0].id];
                    let user = res[0];
                    return this.mysql.query(query)
                        .then(res => {
                            loggerT.verbose('[getUser] QUERY2 RES ==== ', res);
                            let data = [];
                            if(res.length > 0 ) {
                                res.forEach(e => {
                                    data.push(e.name);
                                });
                            }
                            user.roles = data;
                            return Promise.resolve(user);

                        })
                        .catch(err => {
                            loggerT.error('Error when getting user roles, err', err)
                            err.message = 'Error when getting user roles';
                            return Promise.reject(err);
                        })
                    ;
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers, err', err);
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
        query['values'] = [userInfo.email, userInfo.lastname, userInfo.name, userInfo.address, userInfo.phonenumber, userInfo.postalCode, userInfo.city, userInfo.picture_url, id];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY modifyUser :', err);
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
                loggerT.verbose('[createUser] QUERY createUser RES ==== ', res);
                const roleID = that.getRoleID(data.role);

                query['sql']    = Query.INSERT_ROLE;
                query['values'] = [res.insertId, roleID];
                let createAlertQ = {
                    timeout: 40000,
                    sql: Query.INSERT_ALERT,
                    values: [user.organisation, res.insertId]
                };
                let userSubQueries = [that.mysql.query(createAlertQ), that.mysql.query(query)];
                return Promise.all(userSubQueries.map(p => p.catch(e => e)))
                    .then(res => {
                        loggerT.verbose('[createUser] QUERY createRole RES ==== ', res);
                        let genericTemplate = _.template(emailTemplate);
                        let mailOptions = {
                            from: 'NormSup <mail.normsup@gmail.com>', // sender address
                            to: data.email, // list of receivers
                            subject: 'Identifiants plateforme NormSup', // Subject line
                            html: ''
                        };
                        let rTitle = 'Monsieur/Madame';

                        if(data.gender === 'M') {
                            rTitle = 'Monsieur';
                        } else if(data.gender === 'F') {
                            rTitle = 'Madame';
                        }

                        mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'password': data.originalpwd, 'login': data.email});

                        return this.transporter.sendMail(mailOptions)
                            .then(res => {
                                return Promise.resolve(res);
                            })
                            .catch(err => {
                                loggerT.error('[createUser] ERROR ON QUERY sendMail.');
                                return Promise.reject(err);
                            })
                        ;
                    })
                    .catch(err => {
                        loggerT.error('[createUser] QUERY createRole ERR ==== ', err);
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

    public modifyUserRole(id, body) {
        loggerT.verbose('modifyUserRole id : ', id);
        loggerT.verbose('modifyUserRole body : ', body);

        let roleID = this.getRoleID(body.rolename);

        let query = {
            timeout: 40000,
            sql: Query.UPSERT_USER_ROLE,
            values: [id, roleID, roleID]
        };

        return this.mysql.query(query)
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                return Promise.reject(err);
            })
        ;

    }
    public getUsersManagement(data, user) {
        let query = {
            timeout: 40000
        };

        if(data.start) {
            query['sql']    = Query.QUERY_GET_USERS_NOTADMIN_OFFLIM;
            query['values'] = [data.company, user.id, data.limit || 10, data.start];
        } else {
            query['sql'] = Query.QUERY_GET_USERS_NOTADMIN;
            query['values'] = [data.org, user.id];
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

    public getPicture(id) {
        return this.runQuery('FIND_USER_BY_ID', [id])
            .then((res) => {
                // loggerT.verbose('User res', res);
                if(res && res[0] && res[0].picture_url) {
                    return this.getPictureFromDB(res[0].picture_url);
                }
            });
    }

    public deleteUser(id, user) {
        let q = {
            timeout: 40000,
            sql: Query.CHECK_RIGHT_TO_DELETE,
            values: [user.id, 1, id]
        };
        return this.mysql.query(q)
            .then(res => {
                if(res && res[0] && res[0].email) {
                    let query = {
                        timeout: 40000,
                        sql: Query.DELETE_USER,
                        values: [id, user.organisation]
                    };
                    return this.mysql.query(query)
                        .then(res => {
                            if(res) {
                                return Promise.resolve({status: 200, msg: 'Success'});
                            }
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        })
                    ;
                }
            })
            .catch(err => {

            })
        ;
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
