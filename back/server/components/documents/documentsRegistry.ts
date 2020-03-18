import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as Query from './queries';
import config from '../../config/environment/index';

declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;
    private s3: any;

    public constructor(mysql, s3Client) {
        this.mysql = mysql;
        this.s3 = s3Client;
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
        const promises = [];

        files.map(file => {
            loggerT.verbose('file name ===', file.originalname);
            let type;
            if(file.originalname.charAt(0) === 'k') {
                type = 'KBIS';
            } else if(file.originalname.charAt(0) === 'u') {
                type = 'URSSAF';
            } else if(file.originalname.charAt(0) === 'l') {
                type = 'LNTE';
            } else if(file.originalname.charAt(0) === 'c') {
                type = 'COMP';
            } else {
                return;
            }

            file.originalname = file.originalname.substring(1);
            file.originalname = file.originalname.replace(/ /g, "_");
            promises.push(this.uploadFile(file, type + '/' + file.originalname));
            paths.push({path: type + '/' + file.originalname, file: file, type: type});
        });

        return Promise
            .map(paths, (path) => {
                return this.uploadFile(path.file, path.path)
                    .then(() => {
                        let currentFile = path.file;
                        let data = {
                            path: path.path,
                            filename: currentFile.originalname,
                            uploadedBy: user.id,
                            client: user.client,
                            size: currentFile.size,
                            format: currentFile.mimetype,
                            category: path.type
                        };
        
                        return this.createMetadata(data, user);
                    });
            })
            .then((res) => {
                return res;
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

    private uploadFile(file, key) {

        return this.s3.upload({
            Bucket: 'normsup',
            Key: key,
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

        query2['sql']    = Query.UPSERT_SUPPLIER_CONFORMIATY;
        query2['values'] = [data.type.toLowerCase(), user.org_id, 1, data.type.toLowerCase(), 1];

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

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
