export const QUERY_GET_SUPPLIER_OFFLIM = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? WHERE  c.client_id = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_OFFLIM_SEARCH = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ?  WHERE  c.client_id = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_SEARCH = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ?  WHERE  c.client_id = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ?';

export const QUERY_GET_SUPPLIER_LAMBDA = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id WHERE `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ?';
export const QUERY_GET_SUPPLIER_SEARCH_GRP = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ?  WHERE  c.client_id = ? AND `group_id` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_OFFLIM_REPRES = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.id as repres_id, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ?  WHERE  c.client_id = ? LIMIT ? OFFSET ?';

export const QUERY_SUPPLIER_OFFLIM_SE_GROUP = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `group_id` = ? AND `denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER_GROUP = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT JOIN `representatives` as r ON r.organisation_id = o.id WHERE c.client_id = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_SUPPLIER = 'SELECT * FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id';
export const QUERY_GET_SUPPLIER_INFO = 'SELECT * from organisations WHERE siret = ?';

export const QUERY_CHECK_GROUP = 'SELECT * FROM `groups` WHERE `client_id` = ? AND `name` LIKE ?';
export const QUERY_GET_GROUPS = 'SELECT g.name, g.client_id, g.description, g.creation_time, g.id, count(gm.group_id) AS members_count FROM `groups` AS g LEFT OUTER JOIN `group_members` AS gm ON g.id = gm.group_id WHERE `client_id` = ? GROUP BY g.id ORDER BY g.name ASC';
// export const QUERY_GET_GROUPS = 'SELECT * FROM `groups` WHERE `client_id` = ?';

//TODO: Factoriser QUERY_GET_GROUP_MEMBERS & QUERY_GET_GROUP_DETAILS
export const QUERY_GET_GROUP_MEMBERS = 'SELECT o.id, o.denomination, o.siret, o.address, o.siren, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode FROM `group_members` as gm LEFT JOIN `organisations` as o ON o.id = gm.member_id WHERE gm.group_id = ?';
export const QUERY_GET_GROUP_DETAILS = 'SELECT * FROM `groups` AS g LEFT JOIN `group_reminders` as gr ON g.id = gr.group_id WHERE g.client_id = ? AND g.id = ?';
export const QUERY_GET_GROUPS_NAME = 'SELECT * FROM `groups` WHERE `client_id` = ? AND `name` LIKE ?';
export const QUERY_GET_GROUP_SUPPLIERS = 'SELECT g.id, COUNT(u.id) AS users_count, u.username FROM groups AS g LEFT JOIN `organisations` AS u ON g.id = u.group_id ' +
'GROUP BY g.id HAVING users_count > ?';
// export const QUERY_GET_GROUPS_SEARCH = 'SELECT * FROM `groups` AS g LEFT JOIN `client_supplier_relation` as c ON g.organisation = WHERE `org` = ?';

export const QUERY_COUNT_SUPPLIERS_CLIENT = 'SELECT COUNT(*) FROM `organisations` AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id WHERE c.client_id = ?';
export const QUERY_COUNT_SUPPLIERS_SEARCH = 'SELECT COUNT(*) FROM `organisations`  AS o LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id WHERE c.client_id = ? AND `denomination` LIKE ?';
export const QUERY_COUNT_SUPPLIERS = 'SELECT COUNT(*) FROM `organisations`';

export const INSERT_SUPPLIER = 'INSERT INTO `organisations` SET ?';
export const INSERT_SUPP_CONFORMITY = 'INSERT INTO `supplier_conformity` SET ?';
export const INSERT_GROUP = 'INSERT INTO `groups` SET ?';
export const INSERT_GROUP_MEM = 'INSERT INTO `group_members` (group_id, member_id) VALUES ?';
export const INSERT_REL = 'INSERT INTO `client_supplier_relation` SET ?';
export const INSERT_REPRESENTATIVE = 'INSERT INTO `representatives` SET ?';
export const INSERT_GROUP_REMINDERS = 'INSERT INTO `group_reminders` (group_id, activated, legal_docs, comp_docs, frequency) VALUES (?,?,?,?,?)'
export const MODIFY_GROUP_REMINDERS = 'INSERT INTO `group_reminders` (group_id, activated, legal_docs, comp_docs, frequency) VALUES (?,?,?,?,?)' + 
'ON DUPLICATE KEY UPDATE group_id= ?, activated = ?, legal_docs = ?, comp_docs = ?, frequency = ?';
export const INSERT_SUPPLIER_USER = 'INSERT INTO `suppliers` SET ?';

export const DELETE_GROUP = 'DELETE FROM `groups` WHERE id = ? AND client_id = ?';
export const DELETE_GROUP_MEMBERS = 'DELETE FROM `group_members` WHERE group_id = ? AND member_id = ?';
export const DELETE_ALL_GRP_MEM = 'DELETE FROM `group_members` WHERE group_id = ?'
export const UPDATE_GROUP = 'UPDATE `groups` SET name = ? WHERE id = ? AND client_id = ?';
export const DELETE_SUPPLIER_RELATION = 'DELETE FROM `client_supplier_relation` WHERE supplier_id = ? AND client_id = ?';
export const DELETE_SUPPLIER_REPRES = 'DELETE FROM `representatives` WHERE organisation_id = ? AND added_by = ?';

export const UPDATE_REPRES = 'UPDATE `representatives` SET name=?, lastname=?, phonenumber=?, email=? WHERE id = ? AND client_id = ?'
export const DELETE_REPRES = 'DELETE FROM `representatives` WHERE id = ? AND client_id = ?';

/** SUPPLIERS QUERY */
export const FIND_USER_BY_NAME_EMAIL = 'SELECT created_at,org_id,client_id,name,lastname,email,validity_date,password FROM `suppliers` WHERE `email` = ? LIMIT 1';
