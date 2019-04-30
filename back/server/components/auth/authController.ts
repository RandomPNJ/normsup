import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';
import { Get, UseBefore } from 'routing-controllers';
// import {AccessAuthenticatorMiddleware} from '@blockchain-ibm-fr/blocknjser-access';

declare var loggerT: any;

// @UseBefore(AccessAuthenticatorMiddleware)
export default class AuthController {

    // private schemas: any;
    private accessService: any;

    public constructor(accessService: any) {
        this.accessService = accessService;
    }

    public loginAsClient() {

    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
