export const QUERY_GET_SUPPLIER_OFFLIM = 'SELECT * FROM `suppliers` WHERE `client` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_OFFLIM_SEARCH = 'SELECT * FROM `suppliers` WHERE `client` = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_GROUP = 'SELECT * FROM `suppliers` WHERE `client` = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER = 'SELECT * FROM `suppliers` WHERE `client` = ?';


export const QUERY_COUNT_SUPPLIERS_CLIENT = 'SELECT COUNT(*) FROM `suppliers` WHERE `client` = ?';
export const QUERY_COUNT_SUPPLIERS_SEARCH = 'SELECT COUNT(*) FROM `suppliers` WHERE `client` = ? AND `denomination` LIKE ?';
export const QUERY_COUNT_SUPPLIERS = 'SELECT COUNT(*) FROM `suppliers`';

export const INSERT_SUPPLIER = 'INSERT INTO `suppliers` SET ?';