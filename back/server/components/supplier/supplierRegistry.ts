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
        const s = data.search ? data.search = '%' + data.search + '%' : '';

        if(data.hasOwnProperty('start') && data.search) {
            query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM_SEARCH;
            query['values'] = [data.company, s, s, s,  data.limit, data.start];
        } else if(data.hasOwnProperty('start')) {
            query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM;
            query['values'] = [data.company, data.limit, data.start];
        } else {
            query['sql'] = Query.QUERY_GET_SUPPLIER;
            query['values'] = [data.company];
        }
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }


    public countSuppliers(data) {
        let query = {
            timeout: 40000
        };

        const s = data.search ? data.search = '%' + data.search + '%' : '';

        if(data.client && data.search) {
            loggerT.verbose('Recount == ', s);
            query['sql']    = Query.QUERY_COUNT_SUPPLIERS_SEARCH;
            query['values'] = [data.client, s];
        } else if(data.client) {
            query['sql']    = Query.QUERY_COUNT_SUPPLIERS_CLIENT;
            query['values'] = [data.client];
        } else {
            query['sql'] = Query.QUERY_COUNT_SUPPLIERS;
        }
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res[0][Object.keys(res[0])[0]]);
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
