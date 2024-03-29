
import { GroupRemindersSchema } from '../../components/supplier/groupSchema';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => modifyGroupReminders(req, res, app.get('SupplierRegistry')),
};

export function modifyGroupReminders(req, res, SupplierRegistry) {
    let data;
    
    loggerT.verbose('Modifying group reminders.');

    if(!req.params || !req.params.id) {
        const error = new Error(`Invalid request, error message: no id provided.`);
        error['statusCode'] = 400;
        throw error;
    }
    if(!req.body || !req.body.new || !req.body.old) {
        const error = new Error(`Invalid request, error message: body is invalid, old and new settings needed.`);
        error['statusCode'] = 400;
        throw error;
    }


    GroupRemindersSchema.validate(req.body.new, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
        data = val;
    });
    GroupRemindersSchema.validate(req.body.old, (err, val) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
    });

    const id = req.params.id;

    return SupplierRegistry.modifyGroupReminders(id, data)
        .then(res => {
            return res;
        })
        .catch(err => {
            loggerT.verbose('Err  = ', err);
            res.status(500).json({status: err.message})
            return err;
        })
    ;

}
