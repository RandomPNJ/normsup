
declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '',
    services: [''],
    handler: (req, res, app) => modifyGroupReminders(req, res, app.get('SupplierRegistry')),
};

export function modifyGroupReminders(req, res, SupplierRegistry) {
    let data;

    return SupplierRegistry.modifyGroupReminders()
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
