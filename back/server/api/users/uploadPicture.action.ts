import { cloneDeep } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/upload',
    services: [''],
    handler: (req, res, app) => uploadPicture(req, res, app.get('UsersRegistry')),
};

export function uploadPicture(req, res, UsersRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }

    // Protect from no files
    let picture = req.file;
    loggerT.verbose('Uploading picture.');

    // loggerT.verbose('req', req);
    // loggerT.verbose('req originalname', req.files[0].originalname);
    // loggerT.verbose('req fieldname', req.files[0].fieldname);

    return UsersRegistry.uploadPicture(picture, req.decoded)
        .then(res => {
            // loggerT.verbose('Res  = ', res);
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: 'Veuillez choisir un autre nom de groupe.'})
            return err;
        })
    ;
}
