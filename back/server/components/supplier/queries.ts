export const QUERY_GET_SUPPLIER_OFFLIM = 'SELECT * FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_OFFLIM_SEARCH = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_SEARCH = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ?';
export const QUERY_GET_SUPPLIER_SEARCH_GRP = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `group_id` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_OFFLIM_REPRES = 'SELECT * FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? LIMIT ? OFFSET ?';

export const QUERY_SUPPLIER_OFFLIM_SE_GROUP = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `group_id` = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_GROUP = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id';


export const QUERY_CHECK_GROUP = 'SELECT * FROM `groups` WHERE `client_id` = ? AND `name` LIKE ?';

export const QUERY_GET_GROUPS = 'SELECT * FROM `groups` WHERE `client_id` = ?';
export const QUERY_GET_GROUPS_NAME = 'SELECT * FROM `groups` WHERE `client_id` = ? AND `name` LIKE ?';
export const QUERY_GET_GROUP_SUPPLIERS = 'SELECT g.id, COUNT(u.id) AS users_count, u.username FROM groups AS g LEFT JOIN `organisations` AS u ON g.id = u.group_id ' +
'GROUP BY g.id HAVING users_count > ?';
// export const QUERY_GET_GROUPS_SEARCH = 'SELECT * FROM `groups` AS g LEFT JOIN `client_supplier_relation` as c ON g.organisation = WHERE `org` = ?';

export const QUERY_COUNT_SUPPLIERS_CLIENT = 'SELECT COUNT(*) FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id WHERE c.client_id = ?';
export const QUERY_COUNT_SUPPLIERS_SEARCH = 'SELECT COUNT(*) FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id WHERE c.client_id = ? AND `denomination` LIKE ?';
export const QUERY_COUNT_SUPPLIERS = 'SELECT COUNT(*) FROM `organisations`';

export const INSERT_SUPPLIER = 'INSERT INTO `organisations` SET ?';
export const INSERT_GROUP = 'INSERT INTO `groups` SET ?';
export const INSERT_GROUP_MEM = 'INSERT INTO `group_members` (group_id, member_id) VALUES ?';
export const INSERT_REL = 'INSERT INTO `client_supplier_relation` SET ?';
export const INSERT_REPRESENTATIVE = 'INSERT INTO `representatives` SET ?'