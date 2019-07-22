import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';
import { Get, UseBefore } from 'routing-controllers';

const fakeData = require('./fakeData.json');
declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public getSuppliers(data) {
        let query = {
            timeout: 40000
        };

        if(data.start) {
            query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM;
            query['values'] = [data.company, data.limit, data.start];
        } else {
            query['sql'] = Query.QUERY_GET_SUPPLIER;
            query['values'] = [data.company];
        }
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }


    public createSupplier(data) {
        loggerT.verbose('Data : ', data);
        let query = {
            timeout: 40000
        };
        query['sql']    = Query.INSERT_SUPPLIER;
        query['values'] = [data];
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers : ', err);
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
