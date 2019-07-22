export const QUERY_GET_SUPPLIER_OFFLIM = 'SELECT * FROM `suppliers` WHERE `client` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_GROUP = 'SELECT * FROM `suppliers` WHERE `client` = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER = 'SELECT * FROM `suppliers` WHERE `client` = ?';


export const INSERT_SUPPLIER = 'INSERT INTO `suppliers` SET ?';