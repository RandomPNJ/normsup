import {ProductSchema} from '../../components/product/productSchema';
import {includes} from 'lodash';
import * as fs from 'fs';
import { trim, replace } from 'lodash';
import * as moment from 'moment';

declare var loggerT: any;

export default {
    method: 'post',
    uriPattern: '/define_product_bulk',
    services: [''],
    handler: (req, res, app) => createProductBulk(req, app.get('ProductRegistry')),
};

export function createProductBulk(req, ProductRegistry) {
    if (!req.decoded) {
        return Promise.reject(`Cannot get user informations, invalid request.`);
    }
    const user = req.decoded;
    let idBatchComp;
    let body = [];
    let tmp;

    if (!includes(user.roles, 'UpperUser') && !includes(user.roles, 'Validator')) {
        const error = new Error(`Route not permitted`);
        error['statusCode'] = 400;
        throw error;
    }
    loggerT.verbose('Creating product.');

   

    for (let i = 0; i < req.body.length; i++) {
        tmp = req.body[i];
        if(tmp.idBatchComp) {
            idBatchComp = tmp.idBatchComp;
            delete tmp.idBatchComp;
        }

        
        // Checking body fields
        ProductSchema.validate(tmp, (err, value) => {
            if (err && err.details[0].message) {
                const error = new Error(`Invalid request, error message: ${err.details[0].message}.`);
                error['statusCode'] = 400;
                throw error;
            }
        });

        //Checking if the product has only one parent if not a batch
        if(!tmp.batchComponent && tmp.upperParents.length > 1){
            const error = new Error(`Invalid request, too many parents.`);
            error['statusCode'] = 417;
            throw error;
        }

        if (tmp.productionDate) {
            tmp.productionDate = moment(tmp.productionDate, 'DD-MM-YYYY').unix();
            if (isNaN(tmp.productionDate)) {
                const error = new Error(`Invalid date format.`);
                error['statusCode'] = 400;
                delete error.stack;
                throw error;
            }
        }
    
        // Capitalize every string data
        if(tmp.csrIDs) {
            for (let a = 0; a < tmp.csrIDs.length; a++) {
                tmp.csrIDs[a] = tmp.csrIDs[a].toUpperCase();
            }
        } else {
        tmp.csrIDs = [];
        }
        if (tmp.upperParents) {
            for (let a = 0; a < tmp.upperParents.length; a++) {
                tmp.upperParents[a] = tmp.upperParents[a].toUpperCase();
            }
        }

        if (tmp.inputChilds) {
            for (let a = 0; a < tmp.inputChilds.length; a++) {
                tmp.inputChilds[a] = tmp.inputChilds[a].toUpperCase();
            }
        }
        tmp.user = user;
        tmp.idNum              ? tmp.idNum        = tmp.idNum.toUpperCase()       : null;
        tmp.partNameR          ? tmp.partNameR    = tmp.partNameR.toUpperCase()   : null;
        tmp.partNameF          ? tmp.partNameF    = tmp.partNameF.toUpperCase()   : null;
        tmp.partNumberR        ? tmp.partNumberR  = tmp.partNumberR.toUpperCase() : null;
        tmp.partNumberF        ? tmp.partNumberF  = tmp.partNumberF.toUpperCase() : null;
        tmp.supplierPlantName  ? tmp.supplierPlantName  = tmp.supplierPlantName.toUpperCase() : null;

        body.push(JSON.stringify(tmp));
    }

    return ProductRegistry.createProductBulk(body)
        .then(res => {
            if(idBatchComp) {
                idBatchComp = trim(idBatchComp);
                idBatchComp = replace(idBatchComp, ',', '-');
                //let data = '\r\n' + body.idNum + ',' + idBatchComp;
                //fs.writeFileSync('../../resources/data/ID_BATCH_COMP.csv', data);
            }
            return res;
        })
        .catch(err => {
            return err;
        })
    ;

}