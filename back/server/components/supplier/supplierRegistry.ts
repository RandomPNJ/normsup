import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';
import { Get, UseBefore } from 'routing-controllers';

const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class SupplierRegistry {

    mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public getSuppliers() {
        return fakeData;
    }


    public createSupplier(body) {

    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
