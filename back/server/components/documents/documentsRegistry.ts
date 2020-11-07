import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as archiver from 'archiver';
import * as moment from 'moment';
import * as Query from './queries';
import config from '../../config/environment/index';
import Bluebird = require('bluebird');
import { cloneDeep } from 'lodash';

const pdfreader = require('pdfreader');
declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;
    private s3: any;
    private PdfReader: any;
    private urssafApi : String = 'https://www.urssaf.fr/portail/cms/render/live/fr/sites/urssaf/home/utile-et-pratique/verification-attestation/middleColumn/verificationsattestations.verifAttestationAction.do?codeAttestation=';

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
        loggerT.verbose('[createDocument] user === ', user);
        const paths = [];
        // const promises = [];
        let validDate = null;
        let a;
        let query = {
            timeout: 40000,
            sql: Query.GET_ORG_INFO,
            values: [user.org[0].org]
        };
        let finalRes = {};

        return this.mysql.query(query)
            .then(orgRes => {
                loggerT.verbose('ORGRES === ', orgRes);

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
        
                    return this.readPdf(file['buffer'], type)
                        .then(pdfRes => {
                            let push = false;
                            a = pdfRes;

                            if(type === 'URSSAF') {
                                if(a.date !== null) {
                                    validDate = a.date.add(6, 'months').toDate();
                                    loggerT.verbose('Push value', moment().isBefore(validDate));
                                    push = moment().isBefore(validDate);
                                }
                            } else if(type === 'LNTE'){
                                // TO DO
                            } else if(type === 'KBIS') {
                                loggerT.verbose('Kbis a = ', a);
                                if(a !== null) {
                                    validDate = moment(a, 'DD MMMM YYYY').add(6, 'months').format("YYYY-MM-DD HH:mm:ss");
                                    push = moment().isBefore(validDate);
                                }
                            }
                
                            file['originalname'] = file['originalname'].substring(1);
                            file['originalname'] = file['originalname'].replace(/ /g, "_");
                            
                            if(push) {
                                loggerT.verbose('push');
                                paths.push({path: type + '/' + orgRes[0].siren + '/' + type + '_' + moment(new Date()).unix(), file: file, type: type, validityDate: validDate});
                            } else {
                                finalRes[type] = {
                                    msg: 'Document expiré',
                                    status: 'Failure'
                                };
                            }

                        })
                        .catch(err => {
                            loggerT.error('readPdf err', err)
                        })
                    ;
                })
                    .then(() => {
                        if(paths.length > 0) {
                            return Promise
                                .map(paths, (path) => {
                                    return this.uploadFile(path.file, path.path)
                                        .then(() => {
                                            let currentFile = path.file;
                                            let data = {
                                                path: path.path,
                                                filename: currentFile.originalname,
                                                uploadedBy: user.id,
                                                siren: orgRes[0].siren,
                                                size: currentFile.size,
                                                format: currentFile.mimetype,
                                                category: path.type
                                            };
                                            path['validityDate'] !== null ? data['validityDate'] = path['validityDate'] : null;
                                            return this.createMetadata(data, user)
                                                .then(res => {
                                                    // loggerT.verbose('createMetadata RES', res);
                                                    finalRes[path.type] = {
                                                        msg: 'Document ajouté avec succès',
                                                        status: 'Success'
                                                    };
                                                    return Promise.resolve(finalRes);
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
                        } else {
                            return Promise.resolve(finalRes);
                        }
                    })
                    .catch(err => {
                        loggerT.error('Error when creating metadata:', err)
                    })
                ;
            })
            .catch(err => {
                loggerT.error('get_org_info ERR', err);
                return Promise.reject(err);
            })
        ;

    }

    private readPdf(buffer, type) {
        const that = this;
        let rows = {};
        let r = null;
        let firstPage = true;
        let end = false;
        loggerT.verbose('readPdf start type', type);
        return new Promise((resolve, reject) => {
            if(type === 'URSSAF') {
                this.PdfReader.parseBuffer(buffer, (err, item) => {
                    if(err) {
                        return reject(err);
                    }
                    if(!item || end) {
                        return resolve(r);
                    } else if(item.page) {
                        r = that.printRows(rows, type);
                        if(r.date && r.security_code) {
                            return resolve(r);
                        }
                        rows = {}; // clear rows for next page
                    } else if(item.text) {
                        (rows[item.y] = rows[item.y] || []).push(item.text);
                    }
                  })
                ;
            } else if(type === 'KBIS') {
                loggerT.verbose('Parse type KBIS');
                this.PdfReader.parseBuffer(buffer, (err, item) => {
                    if(err) {
                        return reject(err);
                    }
                    if(!item && firstPage) {
                        r = that.printRows(rows, type);
                        if(r) {
                            // r = [r.slice(0, 2), ' ', r.slice(2)].join('');
                            // r = [r.slice(0, r.length-4), ' ', r.slice(r.length-4)].join('');
                            r = this.parseDateFromExtract(r);
                            return resolve(r);
                        }
                        firstPage = false;
                        rows = {}; // clear rows for next page
                    } else if(item.page) {
                        r = that.printRows(rows, type);
                        if(r) {
                            // r = [r.slice(0, 2), ' ', r.slice(2)].join('');
                            // r = [r.slice(0, r.length-4), ' ', r.slice(r.length-4)].join('');
                            r = this.parseDateFromExtract(r);
                            return resolve(r);
                        }
                        rows = {}; // clear rows for next page
                    } else if(item.text) {
                        (rows[item.y] = rows[item.y] || []).push(item.text);
                    } else if(!item) {
                        return resolve(r);
                    }
                  })
                ;
            }
            
        })
        ;
    }

    private printRows(rows, type) {
        let res = null;
        let searchSecurityCode = false;
        if(type === 'KBIS') {
            Object.keys(rows) // => array of y-positions (type: float)
              .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
              .forEach(y => {
                  let a = (rows[y] || []).join("");
                  if(a.indexOf('àjour') !== -1 || a.indexOf('à jour') !== -1) {
                    let dateRegex = /([0-9]{0,1}[0-9])( ){0,1}((J|j)anvier?|(f|F)(é|e)vrier?|(M|m)ars?|(A|a)vril?|(M|m)ai?|(J|j)uin?|(J|j)uillet?|(A|a)o(u|û)t?|(S|s)eptembre?|(O|o)ctobre?|(N|n)ovembre?|(D|d)(e|é)cembre?)( ){0,1}20[1-2][0-9]/g;
                    const found = rows[y].join("").replace(/\s/g,'').match(dateRegex);
                    res = found && found.length > 0 ? found[0] : null;
                  }
                })
            ;
        } else if(type === 'LNTE'){
            // NOT DONE YET
            Object.keys(rows) // => array of y-positions (type: float)
              .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
              .forEach(y => {
                  let a = (rows[y] || []).join("");
                  if(a.indexOf('Fait le') !== -1 || a.indexOf('Faitle') !== -1) {
                    let dateRegex = /([0-9][0-9])( ){0,1}((J|j)anvier?|(f|F)(é|e)vrier?|(M|m)ars?|(A|a)vril?|(M|m)ai?|(J|j)uin?|(J|j)uillet?|(A|a)o(u|û)t?|(S|s)eptembre?|(O|o)ctobre?|(N|n)ovembre?|(D|d)(e|é)cembre?)( ){0,1}20[1-2][0-9]/g;
                    const found = rows[y].join("").replace(/\s/g,'').match(dateRegex);
                    res = (found[0] || null);
                  }
                })
            ;
        } else if(type === 'URSSAF') {
            res = {
                date: '',
                security_code: ''
            };
            // loggerT.verbose('Rows = ', rows);
            Object.keys(rows) // => array of y-positions (type: float)
              .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
              .forEach(y => {
                  let a = (rows[y] || []).join("");
                  if(a.indexOf(', le ') !== -1 || a.indexOf(',le') !== -1) {
                    let found;
                    let dateRegex;
                    if(a.indexOf('/') !== -1) {
                        dateRegex = /([0-9]){2}\/([0-9]){2}\/([0-9]){4}/g;
                        found = rows[y].join("").replace(/\s/g,'').match(dateRegex);
                        if(found[0]) {
                            found[0] = moment(found[0], 'DD/MM/YYYY');
                        }
                    } else {
                        dateRegex = /([0-9][0-9])( ){0,1}((J|j)anvier?|(f|F)(é|e)vrier?|(M|m)ars?|(A|a)vril?|(M|m)ai?|(J|j)uin?|(J|j)uillet?|(A|a)o(u|û)t?|(S|s)eptembre?|(O|o)ctobre?|(N|n)ovembre?|(D|d)(e|é)cembre?)( ){0,1}20[1-2][0-9]/g;
                        found = rows[y].join("").replace(/\s/g,'').match(dateRegex);
                        if(found[0]) {
                            found[0] = moment(found[0], 'DD MMMM YYYY');
                        } 
                    }
                    res.date = (found[0] || null);
                  } else if(a.indexOf('CODE DE SÉCURITÉ') !== -1 || a.indexOf('CODE DE') !== -1 ) {
                    searchSecurityCode = true;
                  }
                  if(searchSecurityCode && a.length === 15) {
                    res.security_code = a;
                  }
                })
            ;
        }
        return res;
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


    private downloadDocument(user, id) {
        let query = {
            timeout: 40000
        };

        query['sql'] = Query.GET_DOCUMENT;
        query['values'] = [id, user.organisation]

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                if(res && res.length > 0) {
                    return this.s3.getObject({
                        Bucket: 'normsup',
                        Key: config.env === 'local' ? 'DEV/' + res[0].path : res[0].path
                    }).promise()
                    ;
                } else {
                    return Promise.reject(new Error('Viewing this document is not possible for the logged in user.'));
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.', err);
                return Promise.reject(err);
            })
        ;
    }


    // TODO EXPORT FROM GROUP
    private exportDocuments(user, data) {
        

        let query = {
            timeout: 40000
        };

        if(data.type === 'SUPPLIER') {
            // WE GET SUPPLIER'S SIREN FROM THE ID VALUES
            let getSuppliersQuery = {
                timeout: 40000,
                sql: '',
                values: [user.organisation]
            };
            let q = Query.GET_ORGS_INFO;
            for (var i = 0; i < data.values.length; i++) {
                if(i===0) {
                    q += '('+data.values[i];
                } else {
                    q += ','+data.values[i];
                }
                if(i===data.values.length-1) {
                    q += ')'
                }
            }
            getSuppliersQuery.sql = q;
            loggerT.verbose('q before === ', q);
            return this.mysql.query(getSuppliersQuery)
                .then(firstRes => {
                    loggerT.verbose('[exportDocument] firstRes ===', firstRes);
                    if(firstRes && firstRes.length > 0) {
                        let sqlQuery = Query.GET_DOCUMENTS;
                        loggerT.verbose('exportDocuments here : ', sqlQuery);
                        sqlQuery += ' AND d.siren IN ';
                        for (var i = 0; i < firstRes.length; i++) {
                            if(i===0) {
                                sqlQuery += '('+firstRes[i].siren;
                            } else {
                                sqlQuery += ','+firstRes[i].siren;
                            }
                            if(i===firstRes.length-1) {
                                sqlQuery += ')'
                            }
                        }
                        sqlQuery += ' AND d.category IN ';
                        for (var i = 0; i < data.docs.length; i++) {
                            if(i===0) {
                                sqlQuery += "('"+data.docs[i]+"'";
                            } else {
                                sqlQuery += ",'"+data.docs[i]+"'";
                            }
                            if(i===data.docs.length-1) {
                                sqlQuery += ')'
                            }
                        }
                        sqlQuery += ' LIMIT 3'; // TO DELETE
                        loggerT.verbose('exportDocuments SQL QUERY : ', sqlQuery);
                        query['sql'] = sqlQuery;
                        query['values'] = [data.startDate, data.endDate];
                        return this.mysql.query(query)
                            .then(res => {
                                loggerT.verbose('[exportDocuments] QUERY RES ==== ', res);
                                if(res && res.length > 0) {
                                    return Promise.resolve(res);
                                } else {
                                    return Promise.reject(new Error('Viewing this document is not possible for the logged in user.'));
                                }
                            })
                            .catch(err => {
                                loggerT.error('[exportDocuments] ERROR ON QUERY getSuppliers.', err);
                                return Promise.reject(err);
                            })
                        ;
                    }
                })
                .catch(err => {
                    loggerT.error('[exportDocument] getSuppliersQuery err ===', err);
                    return Promise.reject(err);
                })
            ;
            
        } else if(data.type === 'GROUP') {
            // TODO
            let getGroupsQuery = {
                timeout: 40000,
                sql: '',
                values: [user.organisation]
            };
            let q = Query.GET_ORGS_INFO_FROM_GROUP;
            for (var i = 0; i < data.values.length; i++) {
                if(i===0) {
                    q += '('+data.values[i];
                } else {
                    q += ','+data.values[i];
                }
                if(i===data.values.length-1) {
                    q += ')'
                }
            }
            getGroupsQuery.sql = q;
            loggerT.verbose('q before === ', q);
            loggerT.verbose('getGroupsQuery values before === ', getGroupsQuery.values);
            return this.mysql.query(getGroupsQuery)
                .then(firstRes => {
                    loggerT.verbose('[exportDocument] getGroupsQuery firstRes ===', firstRes);
                    if(firstRes && firstRes.length > 0) {
                        let sqlQuery = Query.GET_DOCUMENTS;
                        loggerT.verbose('exportDocuments here : ', sqlQuery);
                        sqlQuery += ' AND d.siren IN ';
                        for (var i = 0; i < firstRes.length; i++) {
                            if(i===0) {
                                sqlQuery += '('+firstRes[i].siren;
                            } else {
                                sqlQuery += ','+firstRes[i].siren;
                            }
                            if(i===firstRes.length-1) {
                                sqlQuery += ')'
                            }
                        }
                        sqlQuery += ' AND d.category IN ';
                        for (var i = 0; i < data.docs.length; i++) {
                            if(i===0) {
                                sqlQuery += "('"+data.docs[i]+"'";
                            } else {
                                sqlQuery += ",'"+data.docs[i]+"'";
                            }
                            if(i===data.docs.length-1) {
                                sqlQuery += ')'
                            }
                        }
                        sqlQuery += ' LIMIT 3'; // TO DELETE
                        loggerT.verbose('exportDocuments SQL QUERY : ', sqlQuery);
                        query['sql'] = sqlQuery;
                        query['values'] = [data.startDate, data.endDate];
                        return this.mysql.query(query)
                            .then(res => {
                                loggerT.verbose('[exportDocuments] QUERY getDocuments metadata RES ==== ', res);
                                if(res && res.length > 0) {
                                    return Promise.resolve(res);
                                } else {
                                    return Promise.reject(new Error('Viewing this document is not possible for the logged in user.'));
                                }
                            })
                            .catch(err => {
                                loggerT.error('[exportDocuments] ERROR ON QUERY getDocuments metadata : ', err);
                                return Promise.reject(err);
                            })
                        ;
                    }
                })
                .catch(err => {
                    loggerT.error('[exportDocument] getGroupsQuery err ===', err);
                    return Promise.reject(err);
                })
            ;

        }



    }

    private parseDateFromExtract(s: String) {
        if(!s) {
            return;
        }
        let temp = {};
        let res = '';
        let i = 0;
        let mode = 'number';
        s.split("").forEach(c => {
            if(mode === 'number' && isNaN(c as any) === true) {
                i++;
                mode = 'letter'
            }
            if(mode === 'letter' && isNaN(c as any) === false) {
                i++;
                mode = 'number'
            }
            temp[i] ? temp[i] += c : temp[i] = c;
        });
        Object.keys(temp).forEach(e => {
            if(e == '0')
                res += temp[e]
            else
                res += ' ' + temp[e]
        });
        return res;
    }

    private allSkippingErrors(promises) {
        return Promise.all(
          promises.map(p => p.catch(error => null))
        )
    }

    private createMetadata(data, user, correctData?) {
        loggerT.verbose('[createMetadata] user === ', user);
        loggerT.verbose('[createMetadata] data === ', data);
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };
        let promises = [];
        let datas = [];
        let a;
        let date = data.validityDate ? moment(data.validityDate).format("YYYY-MM-DD HH:mm:ss") : null;
        query['sql']    = Query.INSERT_DOC_METADATA;
        query['values'] = [data];

        if(data.category === 'KBIS') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_KBIS;
        } else if(data.category === 'URSSAF') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_URS;
        } else if(data.category === 'LNTE') {
            query2['sql']    = Query.UPSERT_SUPPLIER_CONF_LNTE;
        }
        promises = [this.mysql.query(query)];
        /**
         * La première ligne est commentée car la 3ème valeur, le 1, signifie que le fournisseur est valide pour le document
         * On la passe à 2 quand on a besoin de validation
         * On la passe à 3 quand le fournisseur est invalide pour le document
         */
        user.org.forEach(o => {
            a = cloneDeep(query2);
            a['values'] = [o.client, o.org, 2, moment().startOf('month').format("YYYY-MM-DD HH:mm:ss"), date, 2, date];
            datas.push(a);
        });
        datas.forEach(d => promises.push(this.mysql.query(d)));
        
        // query2['values'] = [user.client, user.organisation, 1, moment().startOf('month').toDate(), data.validityDate ? data.validityDate : null, 1];

        return Promise.all(promises.map(p => p.catch(e => e)))
            .then((res) => {
                loggerT.verbose('[createMetadata] promise map res', res);
                return res;
            })
        ;
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

    public zipFile(s3, fileNames) {

        let zip = new archiver.create('zip');
        zip.on('end', () => {
            loggerT.verbose('Archiver on end');
        });
        zip.on('warning', () => {
            loggerT.verbose('Archiver on warning');
        });
        zip.on('error', (err) => {
            loggerT.verbose('Archiver on error', err);
        });
        return new Promise((resolve, reject) => {
            let objectSrc;
            fileNames.forEach(fileName => {
                let i = 0;
                let realname = fileName.split('/')[fileName.split('/').length-1];
                objectSrc = s3.getObject({ Bucket: 'normsup', Key: fileName }).createReadStream();
                zip.append(objectSrc, {
                    name: realname + '_' + i + '.pdf'
                });
            });

            // zip.finalize();
            resolve(zip);
        })
    }
    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
