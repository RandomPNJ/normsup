import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as HelperQueries from '../helpers/dbhelpers';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';

declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;

    public constructor(mysql) {
        this.mysql = mysql;
    }

    public getQueryType(data: any) {
        /*
         * start search company group
        */
        let v = '';
        let values = [];
        values.push(data.company);

        if(data.company) { 
            v += 'C'; 
            values.push(data.company);
            loggerT.verbose('Values three === ', values);
        }
        if(data.group) { 
            v += 'G'; 
            values.push(data.group);
            loggerT.verbose('Values four === ', values);
        }
        if(data.search) { 
            v += 'SE';
            data.search = '%' + data.search + '%';
            values.push(data.search);
            values.push(data.search);
            values.push(data.search);
            loggerT.verbose('Values two === ', values);
        }
        if(data.start || data.start === 0) { 
            v += 'S';
            values.push(data.limit);
            values.push(data.start);
            loggerT.verbose('Values one === ', values);
        }

        const final = config.queries[v];
        loggerT.verbose('Values final === ', values);
        loggerT.verbose('Query final === ', final);
        return {
            type: final,
            values: values
        }
    }

    public getSuppliers(data) {
        let query = {
            timeout: 40000
        };
        // const s = data.search ? data.search = '%' + data.search + '%' : '';
        const queryTypeValues = this.getQueryType(data);
        loggerT.verbose('getSuppliers', queryTypeValues);
        query['sql']    = Query[queryTypeValues['type']];
        query['values']    = queryTypeValues['values'];
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    public getGroups(org, data) {
        let query = {
            timeout: 40000
        };
        if(data && data.name) {
            query['sql'] = Query.QUERY_GET_GROUPS_NAME;
            query['values'] = [org, '%'+data.name+'%'];
        } else {
            query['sql'] = Query.QUERY_GET_GROUPS;
            query['values'] = [org];
        }

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
        ;
    }

    public getGroupMembers(id, org) {
        let query = {
            timeout: 40000
        };

        query['sql'] = Query.QUERY_GET_GROUP_MEMBERS;
        query['values'] = [id];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
        ;
    }

    public deleteGroup(id, org) {
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };

        query['sql'] = Query.DELETE_GROUP;
        query['values'] = [id, org];

        query2['sql'] = Query.DELETE_ALL_GRP_MEM;
        query2['values'] = [id];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('QUERY RES deleteGroup ==== ', res);

                return this.mysql.query(query2)
                    .then(res => {
                        return Promise.resolve(res);
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY deleteGroupMembers.');
                        return Promise.reject(err);
                    })
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY deleteGroup.');
                return Promise.reject(err);
            })
        ;
    }
    public deleteRepresentative(id, userID) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                let query = {
                    timeout: 40000
                };
                loggerT.verbose('[deleteRepresentative] id === ', id);
                loggerT.verbose('[deleteRepresentative] res === ', res);
                query['sql'] = Query.DELETE_REPRES;
                query['values'] = [id, user.organisation];
        
                return this.mysql.query(query)
                    .then((res, fields) => {
                        loggerT.verbose('QUERY RES deleteRepresentative ==== ', res);
                        return res;
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY deleteRepresentative.');
                        return Promise.reject(err);
                    })
                ;
        
            })
            .catch(err => {
                Promise.reject('[SupplierRegistry] Could not get user from database, query aborted.');
            })
        ;
    }

    public updateGroup(group, suppliers, suppToDelete) {
        let query = {
            timeout: 40000
        };

        query['sql'] = Query.UPDATE_GROUP;
        query['values'] = [group.name, group.id, group.client_id];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('QUERY RES updateGroup ==== ', res);
                if((suppliers && suppliers.length > 0) || (suppToDelete && suppToDelete.length > 0)) {
                    return this.updateGroupMembers(suppliers, suppToDelete, group.id);
                } else {
                    return Promise.resolve(res);
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY deleteGroup.');
                return Promise.reject(err);
            })
        ;
    }
    
    private updateGroupMembers(suppliers, suppToDelete, group_id) {
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };
        let v = [];
        let promises = [];

        if(suppToDelete && suppToDelete.length > 0) {
            query2['sql'] = Query.DELETE_GROUP_MEMBERS;
            query2['values'] = [group_id];
            suppToDelete.forEach((element, index) => {
                if(index !== 0) {
                    query2['sql'] += ' OR member_id = ?';
                }
                query2['values'].push(element.id);
            });
            loggerT.verbose('query2 ', query2['sql']);
            loggerT.verbose('query2 val', query2['values']);
            promises.push(this.mysql.query(query2));
        }
        if(suppliers && suppliers.length > 0) {
            loggerT.verbose('case two');
            suppliers.forEach(supp => {
                loggerT.verbose('supp id', supp.id);
                v.push([group_id, supp.id]);
            });
    
            query['sql'] = Query.INSERT_GROUP_MEM;
            query['values'] = [v];
            promises.push(this.mysql.query(query));
        }
        
        if(promises.length > 0) {
            return Promise.all(promises);
        }
        // return this.mysql.query(query)
        //     .then((res, fields) => {
        //         loggerT.verbose('QUERY RES updateGroup ==== ', res);
        //         return this.updateGroupMembers(suppliers, suppToDelete);
        //     })
        //     .catch(err => {
        //         loggerT.error('ERROR ON QUERY deleteGroup.');
        //         return Promise.reject(err);
        //     })
        // ;
    }
    public getGroupDetails(org, data) {
        let query = {
            timeout: 40000
        };
        if(data && data.id) {
            query['sql'] = Query.QUERY_GET_GROUP_DETAILS;
            query['values'] = [org, data.id];
        }

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
        ;
    }
    
    public checkGroup(org, data) {
        let query = {
            timeout: 40000
        };
        if(data && data.name) {
            query['sql'] = Query.QUERY_GET_GROUPS_NAME;
            query['values'] = [org, data.name];
        }
        let finalRes;
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                if(res && res.length > 0) {
                    finalRes = {
                        exists: true
                    };
                    return Promise.resolve(finalRes);
                } else {
                    finalRes = {
                        exists: false
                    };
                    return Promise.resolve(finalRes);
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                finalRes = {
                    exists: false
                };
                return Promise.resolve(finalRes);
            })
        ;
    }

    public countSuppliers(data, user) {
        let query = {
            timeout: 40000
        };
        data.client = user.organisation;
        const s = data.search ? data.search = '%' + data.search + '%' : '';
        loggerT.verbose('Count data : ', data);
        if(data.client && data.search) {
            loggerT.verbose('Recount == ', s);
            query['sql']    = Query.QUERY_COUNT_SUPPLIERS_SEARCH;
            query['values'] = [data.client, s];
        } else if(data.client) {
            loggerT.verbose('Recount 2 == ', s);
            query['sql']    = Query.QUERY_COUNT_SUPPLIERS_CLIENT;
            query['values'] = [data.client];
        } else {
            loggerT.verbose('Recount 3 == ', s);
            query['sql'] = Query.QUERY_COUNT_SUPPLIERS;
        }
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res[0][Object.keys(res[0])[0]]);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    public createSupplier(data, userID, representative) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                if(!data.dateCreation)
                    data.dateCreation = new Date();
                let query = {
                    timeout: 40000
                };
                query['sql']    = Query.INSERT_SUPPLIER;
                query['values'] = [data];
        
                return this.mysql.query(query)
                    .then(res => {
                        loggerT.verbose('FIRST QUERY RES ==== ', res);
                        let newInsert = {};
        
                        newInsert['supplier_id'] = res.insertId;
                        newInsert['client_id'] = user.organisation;
                        query['sql']    = Query.INSERT_REL;
                        query['values'] = [newInsert];
        
                        let query2 = { timeout: 40000 };
                        let query3 = { timeout: 40000 };
        
                        representative['organisation_id'] = res.insertId;
                        representative['added_by'] = user.id;
                        representative['client_id'] = user.organisation;
        
                        query2['sql'] = Query.INSERT_REPRESENTATIVE;
                        query2['values'] = [representative]
        
                        query3['sql'] = Query.INSERT_SUPP_CONFORMITY;
                        query3['values'] = [{supplier_id: res.insertId, client_id: user.organisation}];
        
                        return this.allSkippingErrors([
                            this.mysql.query(query),
                            this.mysql.query(query2),
                            this.mysql.query(query3)])
                        ;
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON FIRST QUERY createSuppliers : ', err);
                        if(err.message.includes("Duplicate entry")) {
                            query['sql'] = Query.QUERY_GET_SUPPLIER_INFO;
                            query['values'] = [data.siret, data.siret, data.siret];
                            return this.mysql.query(query)
                                .then(res => {
                                    console.log('err recreate', res);
                                    if(res && res[0] && res[0].id) {
                                        let newInsert = {};
                                        newInsert['supplier_id'] = res[0].id;
                                        newInsert['client_id'] = user.organisation;
                                        query['sql']    = Query.INSERT_REL;
                                        query['values'] = [newInsert];
        
                                        let query2 = {
                                            timeout: 40000
                                        };
                                        let query3 = {
                                            timeout: 40000
                                        };
        
                                        representative['organisation_id'] = res[0].id;
                                        representative['added_by'] = user.id;
                                        representative['client_id'] = user.organisation;
        
                                        query2['sql'] = Query.INSERT_REPRESENTATIVE;
                                        query2['values'] = [representative]
        
                                        query3['sql'] = Query.INSERT_SUPP_CONFORMITY;
                                        query3['values'] = [{supplier_id: res.insertId, client_id: user.organisation}];
        
                                        return this.allSkippingErrors([
                                            this.mysql.query(query),
                                            this.mysql.query(query2),
                                            this.mysql.query(query3)])
                                        ;
                                    }
                                })
                            ;
                        }
                        return Promise.reject(err);
                    })
                ;
            })
            .catch(err => {
                Promise.reject('[SupplierRegistry] Could not get user from database, query aborted.');
            })
        ;
    }

    public deleteSupplier(id, client) {
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };

        query['sql'] = Query.DELETE_SUPPLIER_RELATION;
        query['values'] = [id, client];

        query2['sql'] = Query.DELETE_SUPPLIER_REPRES;
        query2['values'] = [id, client];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('QUERY RES deleteGroup ==== ', res);

                return this.mysql.query(query2)
                    .then(res => {
                        return Promise.resolve(res);
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY deleteGroupMembers.');
                        return Promise.reject(err);
                    })
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY deleteGroup.');
                return Promise.reject(err);
            })
        ;
    }
    public modifyGroupReminders(id, data) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('data = ', data);
        query['sql'] = Query.MODIFY_GROUP_REMINDERS;
        query['values'] = [id, data.activated, data.legal_docs, data.comp_docs, data.frequency, id, data.activated, data.legal_docs, data.comp_docs, data.frequency];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY modifyGroupReminders : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public getConformCount(data, id) {
        let query = {
            timeout: 40000
        };

        query['sql']    = Query.QUERY_COUNT_SUPPLIERS_CLIENT;
        query['values'] = [data.client];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res[0][Object.keys(res[0])[0]]);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
        ;
    }

    public login(username, password) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('username ', username)
        query['sql']    = Query.FIND_USER_BY_NAME_EMAIL;
        query['values'] = [username];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({statusCode: 404, msg: 'User not found.'});
                }
                let user = res[0];
                if(new Date() > new Date(user.validity_date)) {
                    return Promise.reject({statusCode: 400, msg: 'Too late.'});
                }
                return bcrypt.compare(password, user.password)
                    .then(res => {
                        if(res === true) {
                            const payload = {
                                email: user.email,
                                name: user.name,
                                lastname: user.lastname,
                                organisation: user.org_id,
                                client: user.client_id,
                                createTime: new Date(user.created_at),
                                validityDate: user.validity_date
                            };
                            return Promise.resolve(payload);
                        }
                        return Promise.reject({statusCode: 400, msg: 'Wrong credentials.'});
                    })
                    .catch(err => {
                        loggerT.verbose('test err3', err);
                    })
                ;
            })
            .catch(err => {
                return Promise.reject({statusCode: err.statusCode ? err.statusCode : 500, msg: err.msg});
            })
        ;
    }

    public createSupplierUser(data) {
        loggerT.verbose('Data : ', data);

        let query = {
            timeout: 40000
        };
        query['sql']    = Query.INSERT_SUPPLIER_USER;
        query['values'] = [data];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('FIRST QUERY RES ==== ', res);

                return Promise.resolve(res)
                ;
            })
            .catch(err => {
                loggerT.error('ERROR ON FIRST QUERY createSuppliers : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public createGroup(data, suppliers, remindersData) {
        loggerT.verbose('Group data', data);
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };

        let promises = [];

        query['sql']    = Query.INSERT_GROUP;
        query['values'] = [data];
        return this.mysql.query(query)
            .then(res => {
                let insertId = res.insertId;
                if(suppliers && suppliers.length > 0) {
                    let v = [];
                    suppliers.forEach(supp => {
                        loggerT.verbose('supp id', supp.id);
                        v.push([insertId, supp.id]);
                    });
                    
                    query['sql']    = Query.INSERT_GROUP_MEM;
                    query['values'] = [v];
                    promises.push(this.mysql.query(query));
                }
                
                query2['sql']    = Query.INSERT_GROUP_REMINDERS;
                let legal_docs = remindersData.legal_docs ? remindersData.legal_docs : '';
                let comp_docs = remindersData.comp_docs ? remindersData.comp_docs : '';
                query2['values'] = [insertId, 1, legal_docs, comp_docs, remindersData.frequency];
                promises.push(this.mysql.query(query2));

                return Promise.all(promises);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY createGroup : ', err);
                return Promise.reject(err);
            })
        ;
    }

    public updateRepresentative(repres, id, userID) {
        // let user;
        // HelperQueries.getUserFromDB(userID)
        //     .then(res => {
        //         user = res
        //     })
        //     .catch(err => {
        //         Promise.reject('[SupplierRegistry] Could not get user from database, query aborted.');
        //     })
        // ;
        let query = {
            timeout: 40000
        };
        loggerT.verbose('updateRepresentative data ', repres);
        loggerT.verbose('updateRepresentative id ', id);
        query['sql']    = Query.UPDATE_REPRES;
        query['values'] = [repres.name, repres.lastname, repres.phonenumber, repres.email, id, userID.organisation];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('FIRST QUERY updateRepresentative RES ==== ', res);

                return Promise.resolve(res)
                ;
            })
            .catch(err => {
                loggerT.error('ERROR ON FIRST QUERY updateRepresentative : ', err);
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

    private allSkippingErrors(promises) {
        let errs = [];
        return Promise.all(
          promises.map(p => p.catch(error => errs.push(error)))
        )
    }
}
