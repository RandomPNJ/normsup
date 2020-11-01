import { Promise, any } from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as HelperQueries from '../helpers/dbhelpers';
import * as Query from './queries';
import config from '../../config/environment/index';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid/v4';
import { email as emailTemplate, supplierUserEmail, activationMail, duplicateSupplier } from './email';

declare var loggerT: any;

export default class SupplierRegistry {

    private mysql: any;
    private transporter: any;

    public constructor(mysql, mailer) {
        this.mysql = mysql;
        this.transporter = mailer;
    }

    private fromDBtoClient(data) {
        let result;
        // loggerT.verbose('[fromDBtoClient] DATA', data);
        if (Array.isArray(data)) {
            loggerT.verbose('isArray');
            data.map(item => {
                // Get the count of complementary documents for the suppliers
                if (item['comp_docs_count'])
                    item['comp_docs_count'] = parseInt(item['comp_docs_count'], 10);

                // Know if a supplier if valid or not, meaning they have valid legal documents on the platform
                if (item['kbis'] === 1 && item['lnte'] === 1 && item['urssaf'] === 1) {
                    item['valid'] = true;
                    delete item['kbis'];
                    delete item['lnte'];
                    delete item['urssaf'];
                } else {
                    item['valid'] = false;
                    delete item['kbis'];
                    delete item['lnte'];
                    delete item['urssaf'];
                }

                if (item['last_connexion']) {
                    item['offline'] = false;
                    delete item['last_connexion'];
                } else {
                    item['offline'] = true;
                    delete item['last_connexion'];
                }
            });
        }
        // loggerT.verbose('[fromDBtoClient] RESULT', data);
        return data;
    }

    private fromClienttoDB(data) {

    }

    public getQueryType(data: any) {
        /*
         * start search company group
        */
        let v = '';
        let values = [];
        let stateType;

        if (data.company) {
            v += 'C';
        }
        if (data.group) {
            v += 'G';
        }
        if (data.search) {
            v += 'SE';
            data.search = '%' + data.search + '%';
        }
        if (data.state) {
            v += 'ST';
        }

        let final = config.queries[v];
        loggerT.verbose('String final === ', v);
        // loggerT.verbose('Query final === ', final);

        if (v === 'C') {// done
            values = [data.company, moment().startOf('month').toDate(), data.company, data.company, data.limit, data.start];
            final = Query[final];
        } else if (v === 'CGSE') {// done
            values = [data.company, moment().startOf('month').toDate(), data.company, data.group, data.company, data.search, data.limit, data.start];
            final = Query[final];
        } else if (v === 'CG') {// done
            values = [data.group, data.company, moment().startOf('month').toDate(), data.company, data.company, data.limit, data.start];
            final = Query[final];
        } else if (v === 'CSE') {// done
            values = [data.company, moment().startOf('month').toDate(), data.company, data.search, data.search, data.search, data.company, data.limit, data.start];
            final = Query[final];
        } else if (v === 'CST') {// done
            let templateQuery = _.template(Query['GET_SUPPLIER_STATE']);
            if (data.state === 'UPTODATE') {
                final = templateQuery({ 'state': ' AND (sc.kbis = 1 AND sc.lnte = 1 AND sc.urssaf = 1)  ' });
            } else if (data.state === 'NOTUPTODATE') {
                final = templateQuery({ state: ' AND (sc.kbis = 0 OR sc.lnte = 0 OR sc.urssaf = 0 OR sc.kbis is null OR sc.lnte is null OR sc.urssaf is null) ' });
            } else if (data.state === 'OFFLINE') {
                final = templateQuery({ state: ' AND d.last_date IS NULL ' });
            }
            loggerT.verbose('Query computed = ', final);
            values = [data.company, moment().startOf('month').toDate(), data.company, data.company];
        } else if (v === 'CGST') {// done
            let templateQuery = _.template(Query['GET_SUPP_GRP_STATE']);
            if (data.state === 'UPTODATE') {
                final = templateQuery({ 'state': ' AND (sc.kbis = 1 AND sc.lnte = 1 AND sc.urssaf = 1) ' });
            } else if (data.state === 'NOTUPTODATE') {
                final = templateQuery({ state: ' AND (sc.kbis = 0 OR sc.lnte = 0 OR sc.urssaf = 0 OR sc.kbis is null OR sc.lnte is null OR sc.urssaf is null) ' });
            } else if (data.state === 'OFFLINE') {
                final = templateQuery({ state: ' AND d.last_date IS NULL ' });
            }
            loggerT.verbose('Query computed = ', final);
            values = [data.company, moment().startOf('month').toDate(), data.group, data.company, data.company];
        } else if (v === 'CSEST') {// testing
            let templateQuery = _.template(Query['GET_SEARCH_STATE']);
            if (data.state === 'UPTODATE') {
                final = templateQuery({ 'state': ' AND (sc.kbis = 1 AND sc.lnte = 1 AND sc.urssaf = 1) ' });
            } else if (data.state === 'NOTUPTODATE') {
                final = templateQuery({ state: ' AND (sc.kbis = 0 OR sc.lnte = 0 OR sc.urssaf = 0 OR sc.kbis is null OR sc.lnte is null OR sc.urssaf is null) ' });
            } else if (data.state === 'OFFLINE') {
                final = templateQuery({ state: ' AND d.last_date IS NULL ' });
            }
            loggerT.verbose('Query computed = ', final);
            values = [data.company, moment().startOf('month').toDate(), data.company, data.company, data.search, data.search, data.search];
        } else if (v === 'CGSEST') {//

        }

        return {
            type: final,
            values: values
        }
    }

    public getSuppliers(data) {
        let query = {
            timeout: 40000
        };

        if (!data.start) {
            data.start = 0;
        }

        // const s = data.search ? data.search = '%' + data.search + '%' : '';
        const queryTypeValues = this.getQueryType(data);
        loggerT.verbose('getSuppliers', queryTypeValues);
        query['sql'] = queryTypeValues['type'];
        query['values'] = queryTypeValues['values'];
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                loggerT.verbose('QUERY RES ==== ', res);
                res = this.fromDBtoClient(res);
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
        if (data && data.name) {
            query['sql'] = Query.QUERY_GET_GROUPS_NAME;
            query['values'] = [org, '%' + data.name + '%'];
        } else {
            query['sql'] = Query.QUERY_GET_GROUPS;
            query['values'] = [org];
        }

        return this.mysql.query(query)
            .then(res => {

                let sum = this.sum(res, 'members_count');
                res.forEach(e => e.total = sum);
                // loggerT.verbose('QUERY RES ==== ', res);
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
                // loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
            ;
    }

    public deleteGroup(id, org) {
        let query = { timeout: 40000 };
        let query2 = { timeout: 40000 };
        let query3 = { timeout: 40000 };

        query['sql'] = Query.DELETE_GROUP;
        query['values'] = [id, org];

        query2['sql'] = Query.DELETE_ALL_GRP_MEM;
        query2['values'] = [id];

        query3['sql'] = Query.DELETE_GRP_REMINDERS;
        query3['values'] = [id];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('QUERY RES deleteGroup ==== ', res);
                let a = [];
                a.push(this.mysql.query(query2));
                a.push(this.mysql.query(query3));
                return this.allSkippingErrors(a)
                    .then(() => {
                        loggerT.verbose('Group deleted');
                        return Promise.resolve({ msg: 'Group deleted successfully' })
                    })
                    ;
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY deleteGroup.');
                return Promise.reject(err);
            })
            ;
    }

    // REDO THIS FUNCTION
    public deleteRepresentative(id, userID) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                let getRepres = {
                    timeout: 40000,
                    sql: Query.GET_REPRES,
                    values: [id]
                };
                loggerT.verbose('[deleteRepresentative] id  === ', id);
                return this.mysql.query(getRepres)
                    .then(repres => {
                        loggerT.verbose('[deleteRepresentative] repres  === ', repres);
                        if(repres && repres[0]) {
                            let r = repres[0];
                            let query = {
                                timeout: 40000
                            };
                            let query2 = {
                                timeout: 40000,
                                sql: Query.DELETE_SUPPLIER_USER,
                                values: [r.client_id, r.organisation_id]
                            };
                            loggerT.verbose('[deleteRepresentative] id === ', id);
                            loggerT.verbose('[deleteRepresentative] res === ', user);
                            query['sql'] = Query.DELETE_SUPPLIER_REPRES;
                            query['values'] = [id, user.organisation];
                            let prs = [
                                this.mysql.query(query),
                                // this.mysql.query(query2)
                            ];
                            return Promise.all(prs.map(p => p.catch(e => e)))
                                .then((promiseRes) => {
                                    loggerT.verbose('QUERY RES deleteRepresentative ==== ', res);
                                    return Promise.resolve({msg: 'Success', code: 0});
                                })
                                .catch(err => {
                                    loggerT.error('ERROR ON QUERY deleteRepresentative.');
                                    return Promise.reject(err);
                                })
                            ;
                        } else {
                            return Promise.resolve({msg: 'Error: representative not found', code: -1, statusCode: 404});
                        }
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
                if ((suppliers && suppliers.length > 0) || (suppToDelete && suppToDelete.length > 0)) {
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

        if (suppToDelete && suppToDelete.length > 0) {
            query2['sql'] = Query.DELETE_GROUP_MEMBERS;
            query2['values'] = [group_id];
            suppToDelete.forEach((element, index) => {
                if (index !== 0) {
                    query2['sql'] += ' OR member_id = ?';
                }
                query2['values'].push(element.id);
            });
            loggerT.verbose('query2 ', query2['sql']);
            loggerT.verbose('query2 val', query2['values']);
            promises.push(this.mysql.query(query2));
        }
        if (suppliers && suppliers.length > 0) {
            loggerT.verbose('case two');
            suppliers.forEach(supp => {
                loggerT.verbose('supp id', supp.id);
                v.push([group_id, supp.id]);
            });

            query['sql'] = Query.INSERT_GROUP_MEM;
            query['values'] = [v];
            promises.push(this.mysql.query(query));
        }

        if (promises.length > 0) {
            return this.allSkippingErrors(promises);
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
        if (data && data.id) {
            query['sql'] = Query.QUERY_GET_GROUP_DETAILS;
            query['values'] = [org, data.id];
        }

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                // loggerT.verbose('QUERY RES ==== ', res);
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
            ;
    }

    public getGroupsReminders(org, type) {
        let query = {
            timeout: 40000
        };

        if (org) {
            if (type === 'NOTEMPTY') {
                query['sql'] = Query.GET_GROUPS_REMINDERS_NOTEMPTY;
                query['values'] = [org, 3];
            } else {
                query['sql'] = Query.GET_GROUPS_REMINDERS;
                query['values'] = [org, 3];
            }
        } else {
            return Promise.reject(new Error('Could not get the organisation\'s id.'));
        }

        return this.mysql.query(query)
            .then(res => {
                return Promise.resolve(res);
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getGroups.');
                return Promise.reject(err);
            })
            ;
    }

    public getDocuments(params, user) {
        let query = {
            timeout: 40000,
        };
        loggerT.verbose('getDocuments params', params);
        loggerT.verbose('getDocuments user', user);
        if (params.type === 'LEGAL') {
            query['sql'] = Query.SUPP_LEGAL_DOCS;
            query['values'] = [user.organisation, params.id];
        } else if (params.type === 'COMP') {
            query['sql'] = Query.SUPP_COMP_DOCS;
            query['values'] = [user.organisation, params.id];
        }

        return this.mysql.query(query)
            .then(res => {
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
        if (data && data.name) {
            query['sql'] = Query.QUERY_GET_GROUPS_NAME;
            query['values'] = [org, data.name];
        }
        let finalRes;
        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                // loggerT.verbose('QUERY RES ==== ', res);
                if (res && res.length > 0) {
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

    public checkSupplier(userID, data) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                let query = {
                    timeout: 40000
                };
                if (data && data.siret) {
                    query['sql'] = Query.QUERY_CHECK_SUPPLIER_AVAIL;
                    query['values'] = [user.organisation, data.siret, data.siret];
                }
                loggerT.verbose('[checkSupplier] values', query['values']);
                let finalRes;
                return this.mysql.query(query)
                    .then((res, fields) => {
                        loggerT.verbose('[checkSupplier] res', res);
                        if (res && res.length > 0) {
                            let company;
                            for (let i = 0; i < res.length; i++) {
                                if (res[i]['client_id'] === user.organisation) {
                                    company = _.cloneDeep(res[i]);
                                    break;
                                }
                            }

                            if (company) {
                                finalRes = {
                                    exists: true,
                                    hasCompany: true,
                                    company: company
                                };
                            } else {
                                if (res[0]) {
                                    company = res[0];
                                    delete company['id'];
                                    delete company['client_id'];
                                } else {
                                    company = {};
                                }

                                finalRes = {
                                    exists: false,
                                    hasCompany: company ? true : false,
                                    company: company
                                };
                            }
                            loggerT.verbose('[checkSupplier] finalRes', finalRes);
                            return Promise.resolve(finalRes);
                        } else {
                            finalRes = {
                                exists: false,
                                hasCompany: false,
                                company: {}
                            };
                            return Promise.resolve(finalRes);
                        }
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY getSuppliers.');
                        finalRes = {
                            exists: false
                        };
                        return Promise.resolve(finalRes);
                    })
                    ;
            })
            .catch(err => {
                Promise.reject('[SupplierRegistry] Could not get user from database, query aborted.');
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
        if (data.group && data.client && data.search) {

        } else if (data.client && data.search) {
            loggerT.verbose('Recount == ', s);
            query['sql'] = Query.QUERY_COUNT_SUPPLIERS_SEARCH;
            query['values'] = [data.client, s, data.client, s];
        } else if (data.client) {
            loggerT.verbose('Recount 2 == ', s);
            query['sql'] = Query.QUERY_COUNT_SUPPLIERS_CLIENT;
            query['values'] = [data.client, data.client, data.client];
        } else {
            loggerT.verbose('Recount 3 == ', s);
            query['sql'] = Query.QUERY_COUNT_SUPPLIERS;
        }
        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[countSuppliers] res', res)
                let i = 0;
                let j = 0;
                if (res.length > 0) {
                    res.map(element => {
                        if (element.kbis == 1 && element.urssaf == 1 && element.lnte == 1) {
                            i++;
                        }
                        if (element.last_connexion == null) {
                            j++;
                        }
                    });
                    return Promise.resolve({ count: res[0].count, conform: i, offline: j });
                } else {
                    return Promise.resolve({ count: 0, conform: 0, offline: 0 })
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
            ;
    }

    public getDashboardData(data, user) {
        let query = {
            timeout: 40000
        };
        data.client = user.organisation;
        if (data.client) {
            loggerT.verbose('getDashboardData ', data);
            query['sql'] = Query.GET_DASHBOARD_DATA;
            query['values'] = [moment().startOf('month').toDate(), data.client, data.client, data.client];
        } else {
            // throw error;
        }

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[getDashboardData] res', res)
                let i = 0;
                if (res.length > 0) {
                    res.map(element => {
                        if (element.kbis == 1 && element.urssaf == 1 && element.lnte == 1) {
                            i++;
                        }
                    });
                    return Promise.resolve({ count: res[0].count, conform: i, offline: res[0].off });
                } else {
                    return Promise.resolve({ count: -1, conform: -1, offline: -1 })
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getSuppliers.');
                return Promise.reject(err);
            })
            ;
    }

    public createSupplierBis(data, userID, representative) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                if (!data.dateCreation)
                    data.dateCreation = new Date();
                let query = {
                    timeout: 40000
                };
                data.added_by_org = user.organisation;
                query['sql'] = Query.INSERT_SUPPLIER;
                query['values'] = [data];


                return this.mysql.query(query)
                    .then(res => {
                        loggerT.verbose('[createSupplier] FIRST QUERY RES ==== ', res);
                        let createdOrg = res;
                        let newInsert = {
                            supplier_id: res.insertId,
                            client_id: user.organisation
                        };
                        // REPRESENTATIVE 
                        representative['organisation_id'] = createdOrg.insertId;
                        representative['added_by'] = user.id;
                        representative['client_id'] = user.organisation;
                        let confData = {supplier_id: createdOrg.insertId, client_id: user.organisation, start_date: moment().startOf('month').toDate()};
                        let promises = [];
                        promises.push(this.orgConfig(newInsert, confData), this.represConfig(representative))

                        return Promise.all(promises.map(p => p.catch(e => e)))
                            .then((promiseRes) => {
                                loggerT.verbose('[createSupplierBis] RES ', promiseRes)
                                if(promiseRes && promiseRes[1] && promiseRes[1].code === 'ER_DUP_ENTRY') {
                                    return Promise.resolve({msg: 'Representative email already linked to another organisation', code: 1});
                                } else {
                                    let suppData = {
                                        name: representative.name,
                                        lastname: representative.lastname,
                                        email: representative.email,
                                        password: null,
                                        created_at: moment().toDate(),
                                    };
                                    return this.createSupplierUser(suppData, {id: createdOrg.insertId}, {id: user.organisation}, data, {}, promiseRes[1].insertId)
                                        .then(res => {
                                            return Promise.resolve({ msg: 'Supplier and supplier user created successfully.', code: 0 });
                                        })
                                        .catch(err => {
                                            return Promise.resolve({ msg: 'Supplier created but couldn\'t create supplier user.', code: 2 });
                                        })
                                    ;
                                }
                            })
                        ; 
                    })
                    .catch(err => {
                        loggerT.error('[createSupplier] ERROR ON FIRST QUERY createSuppliers : ', err);
                        return Promise.reject(err);
                    })
                ;
            })
            .catch(err => {
                Promise.reject({msg: '[SupplierRegistry] Could not get user from database, query aborted.'});
            })
        ;
    }

    private orgConfig(relData, confData) {
        let q = {
            timeout: 40000,
            sql: Query.INSERT_REL,
            values: [relData],
        };
        let q1 = {
            timeout: 40000,
            sql: Query.INSERT_SUPP_CONFORMITY,
            values: [confData],
        };

        let prs = [];
        prs.push(this.mysql.query(q));
        prs.push(this.mysql.query(q1));
        return Promise.all(prs.map(p => p.catch(e => e)))
            .then((res) => {
                return Promise.resolve(res);
            })
        ;
    }

    private represConfig(repres) {
        let checkQ = {
            timeout: 40000,
            sql: Query.INSERT_REPRESENTATIVE,
            values: [repres],
        };

        return this.mysql.query(checkQ)
            .then((res) => {
                return Promise.resolve(res);
            })
        ;
    }

    public createSupplierUser(data, org, client, supplier, password, represID) {
        loggerT.verbose('[createSupplierUser] Data : ', data);
        loggerT.verbose('[createSupplierUser] supplier : ', supplier);


        let query = {
            timeout: 40000
        };
        let token = uuid();
        data.token;
        query['sql'] = Query.INSERT_SUPPLIER_USER;
        query['values'] = [data];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('[createSupplierUser] RES ON QUERY INSERT_SUPPLIER_USER : ', res);
                return this.supplierConfig(supplier, res.insertId, token, org.id, {id: client.id}, data, false, represID)
                    .then(res => {
                        return Promise.resolve(res);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    })
                ;
            })
            .catch(err => {
                if(err && err.message && err.message.includes("Duplicate entry")) {
                    loggerT.verbose('[createSupplierUser] DUPLICATE ENTRY ');
                    let q = {
                        timeout: 40000,
                        sql: Query.FIND_DUPLICATE_SUPPLIER,
                        values: [data.email]
                    };
                    return this.mysql.query(q)
                        .then(suppRes => {
                            loggerT.verbose('[createSupplierUser] DUPLICATE ENTRY suppRes ', suppRes);
                            if(suppRes && suppRes[0]) {
                                loggerT.verbose('[createSupplierUser] DUPLICATE ENTRY suppRes if ');
                                return this.supplierConfig(supplier, suppRes[0].id, token, org.id, {id: client.id, org_name: suppRes[0].org_name}, data, true, represID)
                                    .then(res => {
                                        return Promise.resolve(res);
                                    })
                                    .catch(err => {
                                        return Promise.reject(err);
                                    })
                                ;
                            } else {
                                loggerT.verbose('[createSupplierUser] DUPLICATE ENTRY suppRes else');
                            }
                        })
                        .catch(suppErr => {
                            loggerT.error('[createSupplierUser] DUPLICATE ENTRY suppErr ', suppErr);

                            return Promise.reject(suppErr);
                        })
                    ;
                } else {
                    loggerT.error('ERROR ON FIRST QUERY createSuppliers : ', err);
                    return Promise.reject(err);
                }
            })
        ;
    }

    private supplierConfig(supplier, id, token, orgID, client, data, duplicate, represID) {

        let addOrgRelation = {
            timeout: 40000,
            sql: Query.INSERT_SUPP_ORG_RELATION,
            values: [client.id, orgID, id, represID]
        };
        let promises = [
            this.mysql.query(addOrgRelation)
        ];
        if(!duplicate) {
            let queryActication = {
                timeout: 40000,
                sql: Query.INSERT_ACC_ACTIVATION,
                values: [id, token, moment().add(7, 'days').toDate()]
            };
            promises.push(this.mysql.query(queryActication))
        }

        return Promise.all(promises.map(p => p.catch(e => e)))
            .then(res => {
                loggerT.verbose('supplierConfig RES ==== ', res);
                let genericTemplate;
                let mailOptions = {
                    from: 'NormSup <mail.normsup@gmail.com>', // sender address
                    to: '', // list of receivers
                    subject: '', // Subject line
                    html: 'Empty message. Failed.'
                };
                
                let denom = '';
                let rTitle = 'Monsieur/Madame';
                denom = supplier.denomination ? ' ' + supplier.denomination.toUpperCase() : '';
                if(data.gender && data.gender === 'M') {
                    rTitle = 'Monsieur';
                } else if(data.gender && data.gender === 'F') {
                    rTitle = 'Madame';
                }
                
                if(!duplicate) {
                    let link = 'https://app.normsup.com/supplier/activation;activationToken=' + token;
                    genericTemplate = _.template(activationMail);
                    mailOptions.subject = 'NormSup: Activation de votre compte fournisseur';
                    mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'link': link });
                } else {
                    genericTemplate = _.template(emailTemplate);
                    mailOptions.subject = "NormSup: Ajout en tant qu'interlocuteur";
                    mailOptions.html = genericTemplate({ 'rTitle': rTitle, 'respresName': _.capitalize(data.lastname), 'client_name': client.org_name, 'denomination': supplier.denomination});
                }
                
                mailOptions.to = data.email;

                return this.transporter.sendMail(mailOptions)
                    .then(() => {
                        return Promise.resolve(res);
                    })
                    .catch(err => {
                        return Promise.reject({ msg: 'Couldn\'t send mail to supplier\'s representative.' })
                    })
                ;
            })
            .catch(err => {
                loggerT.error('[supplierConfig] ERROR ON QUERY account activation : ', err);
            })
        ;
    }

    // TODO: Add supplier account
    public createRepresentative(representative, supplierID, userID) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                let query = { timeout: 40000 };

                representative['organisation_id'] = supplierID;
                representative['added_by'] = user.id;
                representative['client_id'] = user.organisation;

                query['sql'] = Query.INSERT_REPRESENTATIVE;
                query['values'] = [representative]

                return this.represConfig(representative)
                    .then(represConfigRes => {
                        loggerT.verbose('[createRepresentative] represConfigRes ==== ', represConfigRes);
                        if(represConfigRes && represConfigRes.code === 'ER_DUP_ENTRY') {
                            return Promise.resolve({msg: 'Representative email already linked to another organisation', code: 1});
                        } else {
                            let suppData = {
                                name: representative.name,
                                lastname: representative.lastname,
                                email: representative.email,
                                password: null,
                                created_at: moment().toDate(),
                            };
                            let getRepresOrg = {
                                timeout: 40000,
                                sql: Query.QUERY_GET_SUPPLIER_INFO_ID,
                                values: [supplierID]
                            };

                            return this.mysql.query(getRepresOrg)
                                .then(orgRes => {
                                    loggerT.verbose('[createRepresentative] orgRes ==== ', orgRes);
                                    if(orgRes && orgRes[0]) {
                                        return this.createSupplierUser(suppData, {id: supplierID}, {id: user.organisation}, orgRes[0], {}, represConfigRes.insertId)
                                            .then(res => {
                                                return Promise.resolve({ msg: 'Supplier and supplier user created successfully.', code: 0 });
                                            })
                                            .catch(err => {
                                                return Promise.resolve({ msg: 'Supplier created but couldn\'t create supplier user.', code: 2 });
                                            })
                                        ;
                                    }
                                })
                                .catch(err => {

                                })
                            ;
                        }
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY 35279847400016.', err);
                        return Promise.reject(err);
                    })
                    ;

            })
            .catch(err => {
                return Promise.reject(err);
            })
            ;
    }

    public deleteSupplier(id, orgID) {
        // Modify this by CASCADE on SQL
        let query = {
            timeout: 40000
        };
        let query2 = {
            timeout: 40000
        };

        let query3 = {
            timeout: 40000
        };

        let query4 = {
            timeout: 40000
        };
        let query5 = {
            timeout: 40000
        };
        let query6 = {
            timeout: 40000
        };

        query3['sql'] = Query.DELETE_SUPPLIER;
        query3['values'] = [id, orgID];
        query['sql'] = Query.DELETE_SUPPLIER_RELATION;
        query['values'] = [id, orgID];
        query2['sql'] = Query.DELETE_SUPPLIER_REPRES;
        query2['values'] = [id, orgID];
        query4['sql'] = Query.DELETE_SUPPLIER_FROM_GROUP;
        query4['values'] = [id];
        query5['sql'] = Query.DELETE_SUPPLIER_USERS;
        query5['values'] = [id];
        query6['sql'] = Query.DELETE_SUPPLIER_CONFORMITY;
        query6['values'] = [id, orgID];

        return this.mysql.query(query3)
            .then(() => {
                return this.mysql.query(query)
                    .then((res, fields) => {
                        loggerT.verbose('QUERY RES deleteGroup ==== ', res);
                        let q = [this.mysql.query(query2), this.mysql.query(query4), this.mysql.query(query5), this.mysql.query(query6)];
                        // q.push(this.mysql.query(query5)) THIS IS QUERY TO DELETE SUPP CONFORMITY
                        return this.allSkippingErrors(q)
                        // return this.mysql.query(query2)
                        //     .then(res => {
                        //         return Promise.resolve(res);
                        //     })
                        //     .catch(err => {
                        //         loggerT.error('ERROR ON QUERY DELETE_SUPPLIER_REPRES.');
                        //         return Promise.reject(err);
                        //     })
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY DELETE_SUPPLIER_RELATION.');
                        return Promise.reject(err);
                    })
                    ;
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY DELETE_SUPPLIER.');
                return Promise.reject(err);
            })
    }

    public modifyGroupReminders(id, data) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('data = ', data);
        query['sql'] = Query.MODIFY_GROUP_REMINDERS;
        query['values'] = [id, data.activated, data.legal_docs, data.comp_docs, data.frequency, data.next_reminder, id, data.activated, data.legal_docs, data.comp_docs, data.frequency, data.next_reminder];

        return this.mysql.query(query)
            .then(res => {
                // loggerT.verbose('QUERY RES ==== ', res);
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

        query['sql'] = Query.QUERY_COUNT_SUPPLIERS_CLIENT;
        query['values'] = [data.client];

        return this.mysql.query(query)
            .then((res, fields) => {
                loggerT.verbose('fields', fields)
                // loggerT.verbose('QUERY RES ==== ', res);
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
        query['sql'] = Query.SUPPLIER_LOGIN;
        query['values'] = [username];

        return this.mysql.query(query)
            .then(res => {
                if(res.length === 0) {
                    return Promise.reject({ statusCode: 404, msg: 'User not found.' });
                }
                let user = res[0];
                user.orgs = [];
                res.map(r => user.orgs.push({org: r.org_id, client: r.client_id }));
                delete user.org_id;

                return bcrypt.compare(password, user.password)
                    .then(res => {
                        if (res === true) {
                            const payload = {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                lastname: user.lastname,
                                org: user.orgs,
                                createTime: new Date(user.created_at),
                                validityDate: user.validity_date
                            };
                            return Promise.resolve(payload);
                        }
                        return Promise.reject({ statusCode: 400, msg: 'Wrong credentials.' });
                    })
                    .catch(err => {
                        loggerT.verbose('test err3', err);
                    })
                    ;
            })
            .catch(err => {
                return Promise.reject({ statusCode: err.statusCode ? err.statusCode : 500, msg: err.msg });
            })
            ;
    }

    public getCurrentLogged(data) {
        let query = {
            timeout: 40000
        };

        query['sql'] = Query.FIND_SUPPLIER_BY_ID;
        query['values'] = [data.id];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY RES ==== ', res);
                if(res && res.length > 0) {
                    let user = res[0];
                    user.orgs = [];
                    res.map(r => user.orgs.push({org: r.org_id, client: r.client_id }));
                    delete user.org_id;
                    loggerT.verbose('[getCurrentLogged] res === ', user);
                    return Promise.resolve(user);
                } else {
                    return Promise.reject({msg: 'No supplier found', code: -1, statusCode: 404});
                }
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUsers.');
                return Promise.reject(err);
            })
            ;
    }

    // Need to have the monthly supplier connected data to know the rate
    public monthlyConformity(data, userID) {
        return HelperQueries.getUserFromDB(userID)
            .then(res => {
                let user = res[0];
                let query = {
                    timeout: 40000
                };
                if (data && data.startDate) {
                    // let m = moment(data.startDate);
                    // query['sql'] = Query.MONTHLY_CONFORMITY_ENDDATE;
                    // query['values'] = [user.organisation, user.organisation, m.startOf('month'), moment().];
                } else {
                    query['sql'] = Query.MONTHLY_CONFORMITY;
                    query['values'] = [user.organisation, user.organisation, moment().startOf('month').subtract(4, 'months').toDate()];
                }

                return this.mysql.query(query)
                    .then(res => {
                        let conformity = {};
                        res.map(e => {
                            if (!conformity[e.month_evaluated]) {
                                conformity[e.month_evaluated] = {};
                                conformity[e.month_evaluated].totalConnected = 0;
                                conformity[e.month_evaluated].totalConform = 0;
                            }
                            conformity[e.month_evaluated].totalConnected = e.connected_suppliers ? e.connected_suppliers : 0;
                            conformity[e.month_evaluated].totalConform += e.conformity ? e.conformity : 0;
                        });
                        loggerT.verbose('conformity', conformity);
                        return Promise.resolve(conformity);
                    })
                    .catch(err => {
                        loggerT.error('ERROR ON QUERY monthlyConformity :', err);
                        return Promise.reject(err);
                    })
                    ;
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY getUserFromDB :', err);
                Promise.reject('[SupplierRegistry] Could not get user from database, query aborted.');
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

        query['sql'] = Query.INSERT_GROUP;
        query['values'] = [data];
        return this.mysql.query(query)
            .then(res => {
                let insertId = res.insertId;
                if (suppliers && suppliers.length > 0) {
                    let v = [];
                    suppliers.forEach(supp => {
                        loggerT.verbose('supp id', supp.id);
                        v.push([insertId, supp.id]);
                    });

                    query['sql'] = Query.INSERT_GROUP_MEM;
                    query['values'] = [v];
                    promises.push(this.mysql.query(query));
                }

                query2['sql'] = Query.INSERT_GROUP_REMINDERS;
                let legal_docs = remindersData.legal_docs ? remindersData.legal_docs : '';
                let comp_docs = remindersData.comp_docs ? remindersData.comp_docs : '';
                let last_reminder = moment().toDate();
                let new_reminder = moment().add(remindersData.frequency.split('d')[0], 'd').toDate();
                query2['values'] = [insertId, 1, legal_docs, comp_docs, remindersData.frequency.split('d')[0], last_reminder, new_reminder];
                promises.push(this.mysql.query(query2));

                return Promise.all(promises)
                    .then(() => {
                        data.insertId = insertId;
                        data.groupSize = suppliers.length;
                        return data
                    });
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY createGroup : ', err);
                return Promise.reject(err);
            })
            ;
    }

    public supplierLoginHistory(data) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('supplierLoginHistory data ', data);

        query['sql'] = Query.SUPPLIER_LOGIN_HISTORY;
        query['values'] = [data.id, null, data.client, new Date()];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('QUERY supplierLoginHistory RES ==== ', res);

                return Promise.resolve(res)
                    ;
            })
            .catch(err => {
                loggerT.error('ERROR ON QUERY supplierLoginHistory : ', err);
                throw new Error('Error when trying to update supplier login history.');
            })
            ;
    }

    // TODO: Remove & Add supplier account
    public updateRepresentative(repres, id, userID) {
        let query = {
            timeout: 40000
        };
        loggerT.verbose('updateRepresentative data ', repres);
        loggerT.verbose('updateRepresentative id ', id);

        query['sql'] = Query.UPDATE_REPRES;
        query['values'] = [repres.name, repres.lastname, repres.phonenumber, repres.email, id, userID.organisation];

        return this.mysql.query(query)
            .then(res => {
                loggerT.verbose('FIRST QUERY updateRepresentative RES ==== ', res);
                // CREATE supplier account
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

    private sum(collection, key) {
        return _.reduce(collection, (a, b) => a + (b[key] || 0), 0);
    }
}
