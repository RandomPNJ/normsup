import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import config from '../../config/environment/index';
import { Get, UseBefore } from 'routing-controllers';

const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class SupplierRegistry {


    public constructor() {
    }

    public getSuppliers() {
        return fakeData;
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
