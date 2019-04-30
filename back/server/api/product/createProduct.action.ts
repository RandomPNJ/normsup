import {ProductSchema} from '../../components/product/productSchema';
import {includes} from 'lodash';
import * as fs from 'fs';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_product',
    services: [''],
    handler: (req, res, app) => createProduct(req, app.get('ProductRegistry')),
};

export function createProduct(req, ProductRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    const user = req.decoded;
    let idBatchComp;
    if(req.body.idBatchComp) {
        idBatchComp = req.body.idBatchComp;
        delete req.body.idBatchComp;
    }
    const body = req.body;

    if (!includes(user.roles, 'UpperUser') && !includes(user.roles, 'Validator')) {
        const error = new Error(`Route not permitted`);
        error['statusCode'] = 400;
        throw error;
    }
    loggerT.verbose('Creating product.');

    // Checking body fields
    ProductSchema.validate(body, (err, value) => {
        if (err && err.details[0].message) {
            const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
            error['statusCode'] = 400;
            throw error;
        }
    });

    //Checking if the product has only one parent if not a batch
    if(!body.batchComponent && body.upperParents.length > 1){
        const error = new Error(`Invalid request, too many parents.`);
        error['statusCode'] = 417;
        throw error;
    }

    if (body.productionDate) {
        body.productionDate = moment(body.productionDate, 'HH:mm DD-MM-YYYY').unix();
        if (isNaN(body.productionDate)) {
            const error = new Error(`Invalid date format.`);
            error['statusCode'] = 400;
            delete error.stack;
            throw error;
        }
    }

    // Capitalize every string data
    if(body.csrIDs) {
        for (let a = 0; a < body.csrIDs.length; a++) {
            body.csrIDs[a] = body.csrIDs[a].toUpperCase();
        }
    } else {
        body.csrIDs = [];
    }
    if (body.upperParents) {
        for (let a = 0; a < body.upperParents.length; a++) {
            body.upperParents[a] = body.upperParents[a].toUpperCase();
        }
    }

    if (body.inputChilds) {
        for (let a = 0; a < body.inputChilds.length; a++) {
            body.inputChilds[a] = body.inputChilds[a].toUpperCase();
        }
    }
    body.user = user;
    body.idNum              ? body.idNum        = body.idNum.toUpperCase()       : null;
    body.partNameR          ? body.partNameR    = body.partNameR.toUpperCase()   : null;
    body.partNameF          ? body.partNameF    = body.partNameF.toUpperCase()   : null;
    body.partNumberR        ? body.partNumberR  = body.partNumberR.toUpperCase() : null;
    body.partNumberF        ? body.partNumberF  = body.partNumberF.toUpperCase() : null;
    body.supplierPlantName  ? body.supplierPlantName  = body.supplierPlantName.toUpperCase() : null;

    return ProductRegistry.createProduct(body)
        .then(res => {
            if(idBatchComp) {
                idBatchComp = trim(idBatchComp);
                idBatchComp = replace(idBatchComp, ',', '-');
                let data = '\r\n' + body.idNum + ',' + idBatchComp;
                fs.writeFileSync('../../resources/data/ID_BATCH_COMP.csv', data);
            }
            return res;
        })
        .catch(err => {
            return err;
        })
    ;

}
