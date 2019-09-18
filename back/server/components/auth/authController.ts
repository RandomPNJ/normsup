import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';

declare var loggerT: any;

// @UseBefore(AccessAuthenticatorMiddleware)
export default class AuthController {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public login(username: string, password: string) {

    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
