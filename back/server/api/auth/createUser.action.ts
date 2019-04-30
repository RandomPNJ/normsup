import {Promise} from 'bluebird';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => createUser(req.body, app.get('AccessService')),
};

export function createUser(body, AccessService) {
    loggerT.info('Creating user.');

    return AccessService.createUser()
        .then(res => {

        })
        .catch(err => {

        })
    ;
}
