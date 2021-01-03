
// CS  
export const QUERY_GET_SUPPLIER_OFFLIM = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf, o.spont_reminder FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  WHERE  c.client_id = ?  AND o.added_by_org = ? GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf, r.id LIMIT ? OFFSET ?;";
// CSES  AND CSR
export const QUERY_GET_SUPPLIER_OFFLIM_SEARCH = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder FROM `organisations`  AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  WHERE c.client_id = ? AND (`denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ?) AND o.added_by_org = ? GROUP BY o.id,  c.client_id, sc.kbis, sc.lnte, sc.urssaf, r.id LIMIT ? OFFSET ?";

// CGSE   --- RECHECK THIS QUERY
export const QUERY_GET_SUPPLIER_SEARCH_GRP = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count , sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder FROM `organisations`  AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren INNER JOIN `group_members` as gm ON gm.member_id = o.id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  WHERE c.client_id = ? AND `group_id` = ? AND o.added_by_org = ? AND `denomination` LIKE ? GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf, c.client_id, r.id LIMIT ? OFFSET ?;";



// CG
export const QUERY_GET_SUPPLIER_GROUP = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, g.name as group_name, gm.member_id as group_mem_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf, o.spont_reminder FROM `organisations` AS o INNER JOIN `group_members` AS gm ON gm.member_id = o.id AND gm.group_id = ? LEFT JOIN `groups` as g ON g.client_id = ? AND gm.group_id = g.id LEFT JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT JOIN `representatives` as r ON r.organisation_id = o.id LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ? WHERE c.client_id = ? AND o.added_by_org = ? GROUP BY o.id, c.client_id, g.id, sc.kbis, sc.lnte, sc.urssaf,  r.id LIMIT ? OFFSET ?;";

// C 
export const QUERY_GET_SUPPLIER = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  WHERE c.client_id = ? AND o.added_by_org = ? GROUP BY r.id,o.id, sc.kbis, sc.lnte, sc.urssaf LIMIT ? OFFSET ?";

// CGSEST
export const GET_SUPPLIER_GROUP_SEARCH_STATE = 'SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = \'COMP\', 1, 0)) AS comp_docs_count , sc.kbis, sc.lnte, sc.urssaf, o.spont_reminder, histo.last_date FROM `organisations`  AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren INNER JOIN `group_members` as gm ON gm.member_id = o.id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ? LEFT JOIN (select MAX(date_connexion) as last_date, organisation_id as o_id from supplier_connexion_history as sch group by sch.organisation_id) AS histo ON histo.o_id = o.id WHERE c.client_id = ? AND `group_id` = ? AND o.added_by_org = ? AND `denomination` LIKE ? <%= state %> GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf, c.client_id, r.id, histo.last_date LIMIT ? OFFSET ?;';

// CST
export const GET_SUPPLIER_STATE = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder, d.last_date, d.o_id FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  LEFT JOIN (select MAX(date_connexion) as last_date, organisation_id as o_id from supplier_connexion_history as sch group by sch.organisation_id) d ON d.o_id = o.id WHERE c.client_id = ? AND o.added_by_org = ? <%= state %> GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf,  c.creationDate, r.id, d.last_date";

// CSST
export const GET_SUPPLIER_OFFLIM_STATE = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ?  WHERE  c.client_id = ?  AND o.added_by_org = ? GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf LIMIT ? OFFSET ?;";


// CGST
export const GET_SUPP_GRP_STATE = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf, o.spont_reminder, histo.last_date, histo.o_id FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id INNER JOIN `client` as cl ON cl.id = o.added_by_org INNER JOIN `group_members` as gm ON gm.member_id = o.id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ? LEFT JOIN (select MAX(date_connexion) as last_date, organisation_id as o_id from supplier_connexion_history as sch group by sch.organisation_id) AS histo ON histo.o_id = o.id WHERE gm.group_id = ? AND c.client_id = ? AND o.added_by_org = ?  <%= state %> GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf, c.creationDate, r.id, d.last_date;";

// CSEST
export const GET_SEARCH_STATE = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, SUM(if(d.category = 'COMP', 1, 0)) AS comp_docs_count, sc.kbis, sc.lnte, sc.urssaf,  o.spont_reminder, histo.last_date, histo.o_id FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id INNER JOIN `client` as cl ON cl.id = o.added_by_org LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren AND sc.start_date = ? LEFT JOIN (select MAX(date_connexion) as last_date, organisation_id as o_id from supplier_connexion_history as sch group by sch.organisation_id) as histo ON histo.o_id = o.id WHERE c.client_id = ? AND o.added_by_org = ? AND (o.`denomination` LIKE ? OR o.`address` LIKE ? OR o.`siret` LIKE ?) <%= state %> GROUP BY o.id, sc.kbis, sc.lnte, sc.urssaf, c.creationDate, histo.last_date, r.id;";

// No hook
export const QUERY_GET_SUPPLIER_OFFLIM_REPRES = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations` AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id AND r.client_id = ? LEFT OUTER JOIN `document` as d ON d.siren = o.siren   WHERE  c.client_id = ? LIMIT ? OFFSET ?";
// No hook
export const QUERY_GET_SUPPLIER_LAMBDA = "SELECT r.id as repres_id, o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt FROM `organisations`  AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id LEFT OUTER JOIN `document` as d ON d.siren = o.siren  WHERE (`denomination` LIKE ? OR `address` LIKE ? OR siret LIKE ?);";
// No hook
export const QUERY_GET_SUPPLIER_INFO = 'SELECT * from organisations WHERE siret = ?';
export const QUERY_GET_SUPPLIER_INFO_ID = 'SELECT * from organisations WHERE id = ?';

/* ============================================================================================================================================================================================== */


export const QUERY_CHECK_GROUP = 'SELECT * FROM `groups` WHERE `client_id` = ? AND `name` LIKE ?';
export const QUERY_GET_GROUPS = 'SELECT g.name, g.client_id, g.description, g.creation_time, g.id, count(gm.group_id) AS members_count FROM `groups` AS g LEFT OUTER JOIN `group_members` AS gm ON g.id = gm.group_id WHERE `client_id` = ? GROUP BY g.id ORDER BY g.name ASC';
// export const QUERY_GET_GROUPS = 'SELECT * FROM `groups` WHERE `client_id` = ?';

//TODO: Factoriser QUERY_GET_GROUP_MEMBERS & QUERY_GET_GROUP_DETAILS
export const QUERY_GET_GROUP_MEMBERS = 'SELECT o.id, o.denomination, o.siret, o.address, o.siren, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode FROM `group_members` as gm LEFT JOIN `organisations` as o ON o.id = gm.member_id WHERE gm.group_id = ?';
export const QUERY_GET_GROUP_DETAILS = 'SELECT * FROM `groups` AS g LEFT JOIN `group_reminders` as gr ON g.id = gr.group_id WHERE g.client_id = ? AND g.id = ?';
export const QUERY_GET_GROUPS_NAME = 'SELECT g.name, g.client_id, g.description, g.creation_time, g.id, count(gm.group_id) AS members_count FROM `groups` AS g LEFT OUTER JOIN `group_members` AS gm ON g.id = gm.group_id WHERE `client_id` = ? AND `name` LIKE ? GROUP BY g.id ORDER BY g.name ASC';

// export const QUERY_GET_GROUPS_SEARCH = 'SELECT * FROM `groups` AS g LEFT JOIN `client_supplier_relation` as c ON g.organisation = WHERE `org` = ?';



export const GET_GROUPS_REMINDERS = 'SELECT g.id as id, g.name, g.description, gr.activated, gr.legal_docs, gr.comp_docs, gr.frequency, gr.last_reminder, gr.next_reminder FROM group_reminders as gr INNER JOIN `groups` as g ON gr.group_id = g.id WHERE g.client_id = ? ORDER BY gr.next_reminder ASC LIMIT ?';

export const GET_DASHBOARD_DATA = 'SELECT csr.client_id, o.denomination, o.id, r.count as count, sc.kbis, sc.lnte, sc.urssaf, off_supp.off FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON (o.siren = sc.siren AND sc.start_date = ?), (SELECT COUNT(su.id) as off FROM `suppliers` as su INNER JOIN `supplier_org_relation` as sor ON su.id=sor.supplier_id WHERE sor.client_id = ? AND su.last_connexion IS NULL) as off_supp, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id WHERE c.client_id = ?) as r WHERE csr.client_id = ?;';
// Redo GET_DASHBOARD_DATA_SEARCH to be like GET_DASHBOARD_DATA
export const GET_DASHBOARD_DATA_SEARCH = 'SELECT r.count as count, sc.kbis, sc.lnte, sc.urssaf, off_sup.off FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren LEFT JOIN suppliers as s ON o.id = s.org_id, (SELECT COUNT(*) as off FROM `suppliers` as s INNER JOIN `supplier_org_relation` as sor ON s.id=sor.supplier_id WHERE sor.client_id = ? AND s.last_connexion IS NOT NULL) as off_sup, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id WHERE c.client_id = ? AND `denomination` LIKE ?) as r WHERE csr.client_id = ?  AND `denomination` LIKE ?';


// Review these query idk wtf I been doing
export const QUERY_COUNT_SUPPLIERS_CLIENT = 'SELECT r.count as count, sc.kbis, sc.lnte, sc.urssaf FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id WHERE c.client_id = ?) as r WHERE csr.client_id = ?';
export const QUERY_COUNT_SUPPLIERS_SEARCH = 'SELECT r.count as count, sc.kbis, sc.lnte, sc.urssaf FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id WHERE c.client_id = ? AND `denomination` LIKE ?) as r WHERE csr.client_id = ? AND `denomination` LIKE ?';
export const QUERY_COUNT_SUPPLIERS = 'SELECT COUNT(*) FROM `organisations`';
export const QUERY_COUNT_SUPPLIERS_SEARCH_GRP = 'SELECT r.count as count, sc.kbis, sc.lnte, sc.urssaf FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id INNER JOIN group_members as gm ON gm.member_id=org.id AND gm.group_id = ? WHERE c.client_id = ? AND `denomination` LIKE ?) as r WHERE csr.client_id = ? AND `denomination` LIKE ?;';
export const QUERY_COUNT_SUPP_GRP = 'SELECT r.count as count, sc.kbis, sc.lnte, sc.urssaf FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON o.siren = sc.siren, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id INNER JOIN group_members as gm ON gm.member_id=org.id AND gm.group_id = ? WHERE c.client_id = ?) as r WHERE csr.client_id = ?;';


export const GET_GROUPS_REMINDERS_NOTEMPTY = 'SELECT DISTINCT g.id as id, g.name, g.description, gr.activated, gr.legal_docs, gr.comp_docs, gr.frequency, gr.last_reminder, gr.next_reminder FROM group_reminders as gr INNER JOIN `groups` as g ON gr.group_id = g.id INNER JOIN `representatives` as r ON r.client_id = g.client_id INNER JOIN group_members as gm ON gm.group_id = g.id INNER JOIN organisations as o ON o.id = gm.member_id AND o.id = r.organisation_id WHERE g.client_id = ? ORDER BY gr.next_reminder ASC LIMIT ?';
export const QUERY_CHECK_SUPPLIER_AVAIL = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, csr.client_id FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id AND csr.client_id = ? WHERE siret = ? OR siren = ?';

export const INSERT_SUPPLIER = 'INSERT INTO `organisations` SET ?';
export const INSERT_SUPP_CONFORMITY = 'INSERT INTO `supplier_conformity` SET ?';
export const INSERT_GROUP = 'INSERT INTO `groups` SET ?';
export const INSERT_GROUP_MEM = 'INSERT INTO `group_members` (group_id, member_id) VALUES ?';
export const INSERT_REL = 'INSERT INTO `client_supplier_relation` SET ?';
export const INSERT_DOC_REL = 'INSERT INTO `supplier_doc_relation` (doc_id, org_id, client_id) VALUES ?';
export const INSERT_REPRESENTATIVE = 'INSERT INTO `representatives` SET ?'; 
export const INSERT_GROUP_REMINDERS = 'INSERT INTO `group_reminders` (group_id, activated, legal_docs, comp_docs, frequency, last_reminder, next_reminder) VALUES (?,?,?,?,?,?,?)'
export const MODIFY_GROUP_REMINDERS = 'INSERT INTO `group_reminders` (group_id, activated, legal_docs, comp_docs, frequency, next_reminder) VALUES (?,?,?,?,?,?)' + 
'ON DUPLICATE KEY UPDATE group_id= ?, activated = ?, legal_docs = ?, comp_docs = ?, frequency = ?, next_reminder = ?';
export const INSERT_SUPPLIER_USER = 'INSERT INTO `suppliers` SET ?';
export const INSERT_ACC_ACTIVATION = 'INSERT INTO `account_activation` (`user_id`, `token`, `expiration_time`) VALUES (?, ?, ?)'
export const INSERT_SUPP_ORG_RELATION = 'INSERT INTO `supplier_org_relation` (`client_id`, `org_id`, `supplier_id`, `repres_id`) VALUES (?,?,?,?)';

export const DELETE_GROUP = 'DELETE FROM `groups` WHERE id = ? AND client_id = ?';
export const DELETE_GROUP_MEMBERS = 'DELETE FROM `group_members` WHERE group_id = ? AND member_id = ?';
export const DELETE_ALL_GRP_MEM = 'DELETE FROM `group_members` WHERE group_id = ?'
export const UPDATE_GROUP = 'UPDATE `groups` SET name = ? WHERE id = ? AND client_id = ?';
export const DELETE_SUPPLIER_RELATION = 'DELETE FROM `client_supplier_relation` WHERE supplier_id = ? AND client_id = ?';
export const DELETE_SUPPLIER_REPRES = 'DELETE FROM `representatives` WHERE organisation_id = ? AND client_id = ?';
export const DELETE_SUPPLIER = 'DELETE FROM `organisations` WHERE id = ? AND added_by_org = ?';
export const DELETE_SUPPLIER_FROM_GROUP = 'DELETE FROM `group_members` WHERE member_id = ?';
export const DELETE_SUPPLIER_CONFORMITY = 'DELETE FROM `supplier_conformity` WHERE supplier_id = ? AND client_id = ?';
export const DELETE_GRP_REMINDERS = 'DELETE FROM `group_reminders` WHERE group_id = ?';
export const DELETE_SUPPLIER_USERS = 'DELETE FROM `supplier_org_relation` WHERE org_id = ?';
export const DELETE_SUPPLIER_USER = 'DELETE FROM `supplier_org_relation` WHERE client_id = ? AND org_id = ?';

export const UPDATE_REPRES = 'UPDATE `representatives` SET name=?, lastname=?, phonenumber=?, email=? WHERE id = ? AND client_id = ?'
export const DELETE_REPRES = 'DELETE FROM `representatives` WHERE id = ? AND client_id = ?';
export const GET_REPRES = 'SELECT * FROM `representatives` WHERE organisation_id = ?';

/** SUPPLIERS QUERY */
// Need to debug all these
export const SUPPLIER_LOGIN = 'SELECT id,created_at,name,lastname,email,validity_date,password,sor.client_id, sor.org_id FROM `suppliers` INNER JOIN `supplier_org_relation` as sor ON suppliers.id=sor.supplier_id WHERE `email` = ?';
export const FIND_USER_BY_NAME_EMAIL = 'SELECT id,created_at,name,lastname,email,validity_date,password,sor.client_id, sor.org_id FROM `suppliers` INNER JOIN `supplier_org_relation` as sor ON suppliers.id=sor.supplier_id WHERE `email` = ? LIMIT 1';
export const FIND_SUPPLIER_BY_ID = 'SELECT id,created_at,name,lastname,email,validity_date,sor.client_id, sor.org_id FROM `suppliers` INNER JOIN `supplier_org_relation` as sor ON suppliers.id=sor.supplier_id  WHERE `id` = ?';
export const FIND_DUPLICATE_SUPPLIER = 'SELECT s.id,s.created_at,s.name,s.lastname,s.email,s.validity_date,c.org_name,o.denomination FROM `suppliers` as s LEFT JOIN `supplier_org_relation` as sor ON s.id=sor.supplier_id LEFT JOIN  `client` as c ON c.id=sor.client_id LEFT JOIN `organisations` as o ON o.id=sor.org_id WHERE s.email = ? LIMIT 1;';

export const CURRENT_MONTH_CONFORMITY = 'SELECT SUM(d.state) as conformity, MONTH(CURRENT_TIMESTAMP), nb.nb_doc_req, o.siren FROM client_supplier_relation as csr INNER JOIN `organisations` as o ON csr.supplier_id=o.id INNER JOIN document as d ON o.siren = d.siren LEFT JOIN (SELECT COUNT(sdr.doc_id) as nb_doc_req, sdr.org_id FROM `supplier_doc_relation` as sdr GROUP BY sdr.org_id) as nb ON nb.org_id=o.id WHERE csr.client_id = ? AND d.state=1 GROUP BY d.siren, nb.nb_doc_req;';
// export const MONTHLY_CONFORMITY = 'SELECT csr.client_id, csr.supplier_id, IF(sc.kbis <> 1 or sc.lnte <> 1 or sc.urssaf <>1, 0, 1) as conformity, sc.start_date, e.connected_suppliers, MONTH(sc.start_date) as month_evaluated FROM client_supplier_relation as csr INNER JOIN `organisations` as o ON csr.supplier_id=o.id INNER JOIN `supplier_conformity` as sc ON o.siren = sc.siren LEFT JOIN (SELECT COUNT(DISTINCT organisation_id) as connected_suppliers, MONTH(sch.date_connexion) as curr FROM supplier_connexion_history as sch INNER JOIN client_supplier_relation  as csr ON csr.supplier_id = sch.organisation_id INNER JOIN suppliers as s ON s.id = sch.supplier_id WHERE sch.client_id = ? GROUP BY curr) as e ON e.curr = MONTH(sc.start_date) WHERE csr.client_id = ? AND sc.start_date >= ? ORDER BY sc.start_date ASC';
export const MONTHLY_CONFORMITY = 'SELECT o.siren, SUM(d.state) as conformity, MONTH(CURRENT_TIMESTAMP) as month_evaluated, nb.nb_doc_req, e.connected_suppliers as connected_suppliers, 1 as current_month FROM client_supplier_relation as csr INNER JOIN `organisations` as o ON csr.supplier_id=o.id INNER JOIN document as d ON o.siren = d.siren LEFT JOIN (SELECT COUNT(sdr.doc_id) as nb_doc_req, sdr.org_id FROM `supplier_doc_relation` as sdr GROUP BY sdr.org_id) as nb ON nb.org_id=o.id LEFT JOIN (SELECT COUNT(DISTINCT organisation_id) as connected_suppliers, MONTH(sch.date_connexion) as curr FROM supplier_connexion_history as sch INNER JOIN client_supplier_relation  as csr ON csr.supplier_id = sch.organisation_id INNER JOIN suppliers as s ON s.id = sch.supplier_id WHERE sch.client_id = 4 GROUP BY curr) as e ON e.curr = MONTH(CURRENT_TIMESTAMP) WHERE csr.client_id = ? AND d.state=1 GROUP BY d.siren, nb.nb_doc_req, e.connected_suppliers UNION SELECT o.siren, IF(sc.kbis <> 1 or sc.lnte <> 1 or sc.urssaf <>1, 0, 1) as conformity, MONTH(sc.start_date) as month_evaluated, NULL as nb_doc_req, e.connected_suppliers, 0 as current_month FROM client_supplier_relation as csr INNER JOIN `organisations` as o ON csr.supplier_id=o.id INNER JOIN `supplier_conformity` as sc ON o.siren = sc.siren LEFT JOIN (SELECT COUNT(DISTINCT organisation_id) as connected_suppliers, MONTH(sch.date_connexion) as curr FROM supplier_connexion_history as sch INNER JOIN client_supplier_relation  as csr ON csr.supplier_id = sch.organisation_id INNER JOIN suppliers as s ON s.id = sch.supplier_id WHERE sch.client_id = 4 GROUP BY curr) as e ON e.curr = MONTH(sc.start_date) WHERE csr.client_id = ? AND sc.start_date >= ? ORDER BY month_evaluated ASC;';
// export const MONTHLY_CONFORMITY_ENDDATE = 'SELECT csr.client_id, csr.supplier_id, IF(sc.kbis <> 1 or sc.lnte <> 1 or sc.urssaf <>1, 0, 1) as conformity, sc.start_date, e.connected_suppliers, MONTH(sc.start_date) as month_evaluated FROM client_supplier_relation as csr INNER JOIN `supplier_conformity` as sc ON csr.supplier_id = sc.supplier_id LEFT JOIN (SELECT COUNT(DISTINCT organisation_id) as connected_suppliers, MONTH(sch.date_connexion) as curr FROM supplier_connexion_history as sch INNER JOIN client_supplier_relation  as csr ON csr.supplier_id = sch.organisation_id INNER JOIN suppliers as s ON s.id = sch.supplier_id WHERE sch.client_id = ? GROUP BY curr) as e ON e.curr = MONTH(sc.start_date) WHERE csr.client_id = ? AND sc.start_date BETWEEN ? AND ? ORDER BY sc.start_date ASC';
export const SUPPLIER_LOGIN_HISTORY = 'INSERT INTO supplier_connexion_history(supplier_id, organisation_id, client_id, date_connexion) VALUES (?, ?, ?, ?)'

export const SUPP_LEGAL_DOCS = "SELECT * FROM normsup.document as d INNER JOIN organisations as o ON d.siren=o.siren WHERE o.added_by_org = ? AND o.id = ? AND (category = 'KBIS' OR category = 'LNTE' OR category = 'URSSAF');";
export const SUPP_COMP_DOCS = "SELECT * FROM normsup.document as d INNER JOIN organisations as o ON d.siren=o.siren WHERE o.added_by_org = ? AND o.id = ? AND (category <> 'KBIS' AND category <> 'LNTE' AND category <> 'URSSAF');";

export const GET_LEGAL_DOCUMENT_REQUIRED = 'SELECT o.siren,dt.name, dt.type, dt.description, d.validityDate FROM doc_types as dt INNER JOIN supplier_doc_relation as sdr ON dt.id=sdr.doc_id INNER JOIN organisations as o ON o.id=sdr.org_id LEFT JOIN document as d ON d.siren=o.siren AND d.category=dt.name AND d.state=1 WHERE ';
export const CLIENT_LIST_DOC = 'SELECT * FROM supplier_org_relation as sor INNER JOIN client as c ON sor.client_id=c.id INNER JOIN supplier_doc_relation as sdr ON sdr.client_id=c.id AND sdr.org_id=sor.org_id INNER JOIN doc_types as dt ON dt.id=sdr.doc_id AND dt.name = ? WHERE sor.supplier_id = ? ;';

export const ACTIVE_DOC_DETAILS = 'SELECT d.uploadedBy, s.name, s.lastname, d.state, d.validityDate, s.id as docUploaderID, d.createdAt FROM supplier_org_relation as sor INNER JOIN client as c ON sor.client_id=c.id INNER JOIN supplier_doc_relation as sdr ON sdr.client_id=c.id AND sdr.org_id=sor.org_id INNER JOIN doc_types as dt ON dt.id=sdr.doc_id AND dt.name=? INNER JOIN organisations as o ON o.id=sor.org_id INNER JOIN document as d ON d.siren=o.siren LEFT JOIN suppliers as s ON s.id=d.uploadedBy WHERE sor.supplier_id = ? AND d.category = ? ANd d.state = 1;';