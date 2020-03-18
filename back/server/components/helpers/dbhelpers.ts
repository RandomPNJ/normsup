import * as _ from 'lodash';
import app from '../../app';
import * as HelperQueries from './helperQueries';

const loggerTxt: String = '[DbHelpers] ';
declare var loggerT: any;

export async function getUserFromDB(userID) {
    console.log(loggerTxt, 'getUserFromDB userID', userID);
    let mysql = app.get('db:sqlDB');
    let query = {
        timeout: 40000
    };
    query['sql']    = HelperQueries.GET_USER;
    query['values'] = [userID.id];
    return mysql.query(query);
        // .then(res => {
        //     console.log(loggerTxt, 'getUserFromDB res', res);
        //     if(res && res[0]) {
        //         return Promise.resolve(res[0]);
        //     }
        // })
        // .catch(err => {
        //     console.log(loggerTxt, 'getUserFromDB err', err);
        // })
    // ;
}