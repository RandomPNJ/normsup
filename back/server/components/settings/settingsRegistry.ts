import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';

declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public getAlerts(clientID) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.QUERY_GET_ALERT_SETTINGS;
        query['values'] = [clientID];
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields);
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res[0]);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    public manageAlerts(data) {
        // loggerT.verbose('Data : ', data);
        let query = {
            timeout: 40000
        };
        const id = data.client_id;
        delete data.clientID;
        const sqlParams = [data.alerts_state, data.alert_valid_sup, data.alert_invalid_sup, data.alert_invalid_mail, data.alert_frequency, data.alert_offline_sup];
        // Object.keys(data).forEach(key => {
        //     sqlParams.push(data[key]);
        // });
        // loggerT.verbose('params : ', [id].concat(sqlParams).concat(sqlParams));
        query['sql']    = Query.INSERT_ALERT;
        query['values'] = [id].concat(sqlParams).concat(sqlParams);

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

    public getReminders(data) {
        // let query = {
        //     timeout: 40000
        // };
        // const s = data.search ? data.search = '%' + data.search + '%' : '';

        // if(data.hasOwnProperty('start') && data.search) {
        //     query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM_SEARCH;
        //     query['values'] = [data.company, s, s, s,  data.limit, data.start];
        // } else if(data.hasOwnProperty('start')) {
        //     query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM;
        //     query['values'] = [data.company, data.limit, data.start];
        // } else {
        //     query['sql'] = Query.QUERY_GET_SUPPLIER;
        //     query['values'] = [data.company];
        // }
        // return this.mysql.query(query)
        //     .then((res, fields) => {
        //         loggerT.verbose('fields', fields)
        //         loggerT.verbose('QUERY RES ==== ', res);
        //         return Promise.resolve(res);
        //     })
        //     .catch(err => {
        //         loggerT.error('ERROR ON QUERY getSuppliers.');
        //         return Promise.reject(err);
        //     })
        // ;
    }

    public manageReminders(data) {
        // loggerT.verbose('Data : ', data);
        // let query = {
        //     timeout: 40000
        // };
        // query['sql']    = Query.INSERT_SUPPLIER;
        // query['values'] = [data];
        // return this.mysql.query(query)
        //     .then(res => {
        //         loggerT.verbose('QUERY RES ==== ', res);
        //         return Promise.resolve(res);
        //     })
        //     .catch(err => {
        //         loggerT.error('ERROR ON QUERY getSuppliers : ', err);
        //         return Promise.reject(err);
        //     })
        // ;
    }

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
