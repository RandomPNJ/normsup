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


    public createDocument(file, meta, user) {

        const path = meta.category + '/' + meta.filename;

        // let data = {
        //     path: path,
        //     filename: meta.filename,
        //     uploadedBy: user.id,
        //     client: user.client,
        //     size: file.size,
        //     type: file.mimetype,
        //     category: meta.category
        // };
        // loggerT.verbose('METADATA === ', data);
        return this.uploadFile(file, path)
            .then((res, err) => {
                if(err) {
                    return err;
                }
                let data = {
                    path: path,
                    filename: meta.filename,
                    uploadedBy: user.id,
                    client: user.client,
                    size: file.size,
                    type: file.mimetype,
                    category: meta.category
                };

                return this.createMetadata(data);

            })
        ;
    }

    private uploadFile(file, key) {

        return this.s3.upload({
            Bucket: 'normsup-storage',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }).promise()
        ;
    }

    private createMetadata(data) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.INSERT_DOC_METADATA;
        query['values'] = [data];
        
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

    private throwError(message?: string): void {
        if (message) {
            throw new Error(message);
        }
        throw new Error();
    }
}
