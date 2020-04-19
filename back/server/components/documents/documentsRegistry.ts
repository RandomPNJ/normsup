import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
// import * as pdfreader from 'pdfreader';
import * as moment from 'moment';
import * as Query from './queries';
import config from '../../config/environment/index';
import Bluebird = require('bluebird');

const pdfreader = require('pdfreader');
declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;
    private s3: any;
    private PdfReader: any;

    public constructor(mysql, s3Client) {
        this.mysql = mysql;
        this.s3 = s3Client;
        this.PdfReader = new pdfreader.PdfReader();
    }

    public getDocuments(data) {
        // let query = {
        //     timeout: 40000
        // };

        // if(data.start) {
        //     query['sql']    = Query.QUERY_GET_SUPPLIER_OFFLIM;
        //     query['values'] = [data.company, data.limit, data.start];
        // } else {
        //     query['sql'] = Query.QUERY_GET_SUPPLIER;
        //     query['values'] = [data.company];
        // }
        // return this.mysql.query(query)
        //     .then(res => {
        //         loggerT.verbose('QUERY RES ==== ', res);
        //         return Promise.resolve(res);
        //     })
        //     .catch(err => {
        //         loggerT.error('ERROR ON QUERY getSuppliers.');
        //         return Promise.reject(err);
        //     })
        // ;
        return Promise.resolve([
            { id: 1, filename: 'kBiS', status: 'valid', expirationdate: 1565452988},
            { id: 2, filename: 'urssaf', status: 'invalid', expirationdate: 1565452988 },
            { id: 3, filename: 'lnTE', status: '', expirationdate: 1565452988 }
        ]);
    }


    public createDocument(files, user) {
        const paths = [];
        // const promises = [];
        let validDate = null;
        let a;
        return Promise.map(files, file => {
            loggerT.verbose('file name ===', file['originalname']);
            let type;
            if(file['originalname'].charAt(0) === 'k') {
                type = 'KBIS';
                // a = this.readPdf(file['buffer'], type);
            } else if(file['originalname'].charAt(0) === 'u') {
                type = 'URSSAF';
            } else if(file['originalname'].charAt(0) === 'l') {
                type = 'LNTE';
            } else if(file['originalname'].charAt(0) === 'c') {
                type = 'COMP';
            } else {
                return;
            }

            return this.readPdf(file['buffer'])
                .then(res => {
                    a = res;
                    loggerT.verbose('a ====', a);
                    if(a !== null) {
                        validDate = moment(a, 'DD MMMM YYYY').toDate();
                    } else {
                        validDate = a;
                    }
        
                    file['originalname'] = file['originalname'].substring(1);
                    file['originalname'] = file['originalname'].replace(/ /g, "_");
                    // promises.push(this.uploadFile(file, type + '/' + user.client + '/' + user.organisation + '/' + file['originalname']));
                    paths.push({path: type + '/' + user.client + '/' + user.organisation + '/' + file['originalname'], file: file, type: type, validityDate: validDate});
                })
                .catch(err => {
                    loggerT.error('readPdf err', err)
                })
            ;
        })
            .then(res => {
                return Promise
                    .map(paths, (path) => {
                        return this.uploadFile(path.file, path.path)
                            .then(() => {
                                let currentFile = path.file;
                                let data = {
                                    path: path.path,
                                    filename: currentFile.originalname,
                                    uploadedBy: user.id,
                                    supplier: user.organisation,
                                    client: user.client,
                                    size: currentFile.size,
                                    format: currentFile.mimetype,
                                    category: path.type
                                };
                                path['validityDate'] !== null ? data['validityDate'] = path['validityDate'] : null;
                                return this.createMetadata(data, user)
                                    .then(res => {
                                        loggerT.verbose('createMetadata RES', res);
                                        return Promise.resolve(res);
                                    })
                                    .catch(err => {
                                        loggerT.error('createMetadata ERR', err);
                                        return Promise.reject(err);
                                    })
                                ;
                            })
                        ;
                    })
                    .then((res) => {
                        return res;
                    })
                ;
            })
            .catch(err => {

            })
        ;

        // return this.allSkippingErrors(promises)
        //     .then(res => {
        //         loggerT.verbose('[SupplierRegistry] createDocument res ', res);
        //     })
        //     .then(err => {
        //         loggerT.error('[SupplierRegistry] createDocument err ', err);
        //     })
        // ;

    }

    private readPdf(buffer) {
        const that = this;
        let rows = {};
        let r = null;
        loggerT.verbose('readPdf start')
        return new Promise((resolve, reject) => {
            this.PdfReader.parseBuffer(buffer, (err, item) => {
                if(err) {
                    return reject(err);
                }
                if(!item) {
                    return resolve(r);
                } else if (item.page) {
                    r = that.printRows(rows);
                    if(r) {
                        r = [r.slice(0, 2), ' ', r.slice(2)].join('');
                        r = [r.slice(0, r.length-4), ' ', r.slice(r.length-4)].join('');
                        return resolve(r);
                    }
                    rows = {}; // clear rows for next page
                  } else if (item.text) {
                    (rows[item.y] = rows[item.y] || []).push(item.text);
                  }
              })
            ;
        })
        ;
    }

    
    private uploadFile(file, key) {

        return this.s3.upload({
            Bucket: 'normsup',
            Key: config.env === 'local' ? 'DEV/' + key : key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }).promise()
        ;
    }

    private allSkippingErrors(promises) {
        return Promise.all(
          promises.map(p => p.catch(error => null))
        )
    }

    private createMetadata(data, user) {
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };

        query['sql']    = Query.INSERT_DOC_METADATA;
        query['values'] = [data];

        if(data.category === 'KBIS') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_KBIS;
        } else if(data.category === 'URSSAF') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_URS;
        } else if(data.category === 'LNTE') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_LNTE;
        }

        query2['values'] = [user.client, user.organisation, 1, moment().startOf('month').toDate(), moment().endOf('month').toDate(), 1];

        if(data.validityDate) {
            query2['values'].push(data.validityDate);
        } else {
            query2['values'].push(null);
        }

        let promises = [this.mysql.query(query), this.mysql.query(query2)];

        return Promise
            .map(promises, (promise) => {
                loggerT.verbose('[createMetadata] promise map')
            })
            .then((res) => {
                return res;
            })
        ;
    }

    private printRows(rows) {
        let res = null;
        Object.keys(rows) // => array of y-positions (type: float)
          .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
          .forEach(y => {
              let a = (rows[y] || []).join("");
              if(a.indexOf('àjour') !== -1 || a.indexOf('à jour') !== -1) {
                let dateRegex = /([0-9][0-9])( ){0,1}((J|j)anvier?|(f|F)(é|e)vrier?|(M|m)ars?|(A|a)vril?|(M|m)ai?|(J|j)uin?|(J|j)uillet?|(A|a)o(u|û)t?|(S|s)eptembre?|(O|o)ctobre?|(N|n)ovembre?|(D|d)(e|é)cembre?)( ){0,1}20[1-2][0-9]/g;
                const found = rows[y].join("").replace(/\s/g,'').match(dateRegex);
                res = (found[0] || null);
              }
            })
        ;
        return res;
    }
    private replaceDate(date) {
        let res = '';
        let trim = _.trim(date);
        let i = 0;
        let count = 0
        while(i < trim.length) {
            if(!isNaN(parseInt(trim.charAt(i)))) {
                res += trim.charAt(i);
                if(++count == 2) {
                    res += '-';
                    break;
                }
            }
            i++;
        }
    
        if(trim.indexOf('Janvier') !== -1 || trim.indexOf('janvier') !== -1) {
            res += '01-';
        } else if(trim.indexOf('Février') !== -1 || trim.indexOf('février') !== -1  || trim.indexOf('fevrier') !== -1  || trim.indexOf('Fvrier') !== -1) {
            res += '02-';
        } else if(trim.indexOf('Mars') !== -1 || trim.indexOf('mars') !== -1) {
            res += '03-';
        } else if(trim.indexOf('Avril') !== -1 || trim.indexOf('avrim') !== -1) {
            res += '04-';
        } else if(trim.indexOf('Mai') !== -1 || trim.indexOf('mai') !== -1) {
            res += '05-';
        } else if(trim.indexOf('Juin') !== -1 || trim.indexOf('juin') !== -1) {
            res += '06-';
        } else if(trim.indexOf('Juillet') !== -1 || trim.indexOf('juillet') !== -1) {
            res += '07-';
        } else if(trim.indexOf('Août') !== -1 || trim.indexOf('août') !== -1 || trim.indexOf('Aout') !== -1 || trim.indexOf('aout') !== -1) {
            res += '08-';
        } else if(trim.indexOf('Septembre') !== -1 || trim.indexOf('septembre') !== -1) {
            res += '09-';
        } else if(trim.indexOf('Octobre') !== -1 || trim.indexOf('octobre') !== -1) {
            res += '10-';
        } else if(trim.indexOf('Novembre') !== -1 || trim.indexOf('novembre') !== -1) {
            res += '11-';
        } else if(trim.indexOf('Décembre') !== -1 || trim.indexOf('décembre') !== -1 || trim.indexOf('Decembre') !== -1 || trim.indexOf('decembre') !== -1) {
            res += '12-';
        }
    
        let regexYear = /20[0-9]{2}/g;
        let match = trim.match(regexYear)
        if(match.length > 0) {
            res += _.trim(match[0]);
        } else {
            return false;
        }
        loggerT.verbose('[replaceDate] res ===', res);
        return res;
    }
    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
