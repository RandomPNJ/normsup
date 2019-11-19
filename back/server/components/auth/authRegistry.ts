import { Promise } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';
import * as jwt from 'jsonwebtoken';

declare var loggerT: any;

export default class AuthRegistry {

    private mysql: any;

    public constructor() {
        // this.mysql = mysql;
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
