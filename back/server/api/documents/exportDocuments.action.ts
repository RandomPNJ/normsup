import 'reflect-metadata';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config/environment/index';
import { createReadStream } from 'fs';
import { Readable, Stream } from 'stream';
import * as archiver from 'archiver';
import * as s3Zip from 's3-zip';

declare var loggerT: any;


export default {
    method: 'get',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => exportDocuments(req, res, app.get('DocumentsRegistry'), app.get('s3')),
};

export function exportDocuments(req, res, DocumentsRegistry, s3) {
    if(!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    loggerT.verbose('Exporting documents.');

    // s3 variables
    type S3DownloadStreamDetails = { stream: Readable; filename: string };
    

    let data = req.query;

    if(!data.startDate || !data.endDate) {
        const error = new Error(`Invalid request, please provide start and end date.`);
        error['statusCode'] = 400;
        throw error;
    } else {
        data.startDate = moment(data.startDate, 'DD-MM-YYYY').toDate();
        data.endDate = moment(data.endDate, 'DD-MM-YYYY').toDate();
    }

    if(!data.type) {
        const error = new Error(`Invalid request, please provide query type.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!data.docs) {
        const error = new Error(`Invalid request, please provide document types.`);
        error['statusCode'] = 400;
        throw error;
    } else {
        data.docs = data.docs.split(',');
        if(data.docs.length === 0) {
            const error = new Error(`Invalid request, please provide document types.`);
            error['statusCode'] = 400;
            throw error;
        }
    }
    if(!data.values) {
        const error = new Error(`Invalid request, please provide values.`);
        error['statusCode'] = 400;
        throw error;
    } else {
        data.values = data.values.split(',');
        if(data.values.length === 0) {
            const error = new Error(`Invalid request, please provide values.`);
            error['statusCode'] = 400;
            throw error;
        }
    }

    loggerT.verbose('Data after :', data);
    return DocumentsRegistry.exportDocuments(req.decoded, data)
        .then(result => {
            if(result) {
                let files = [];
                result.forEach(element => {
                    files.push('DEV/'+element.path);
                });
                res.set({'Content-Type': 'application/zip'});
                return DocumentsRegistry.zipFile(s3, files)
                    .then(resultTwo => {
                        resultTwo.finalize();
                        let timestamp = new Date().getTime();
                        let fileName = `normsup_${timestamp}.zip`;
                        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                        return resultTwo.pipe(res);
                    })
                    .catch(err => {
                        loggerT.error('ERROR DocumentsRegistry.zipFile : ', err)
                    })
                ;
            } else {
                return res.status(404).json({
                    msg: 'No picture found.'
                });
            }
        })
        .catch(err => {
            delete err.stackTrace;
            throw err;
        })
    ;
}
