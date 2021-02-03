export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation ,create_time,createdBy) values (?,?,?,?,?,?,?,?)';
export const INSERT_CLIENT = 'INSERT INTO `client` (org_name, address, postalCode, city, country) values (?, ?, ?, ?, ?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';
export const INSERT_USER_PREFERENCES = 'INSERT INTO `client_preferences` (user_id, client_id) VALUES (?,?)';
export const INSERT_ADMIN = 'INSERT INTO `admins` (name, lastname, email, password, username) values (?,?,?,?,?)';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city,ur.roleID,r.name AS rolename, c.org_name, c.id as org_id FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id LEFT JOIN `client` as c ON c.id = u.organisation';
export const QUERY_GET_USERS_OFFLIM = "";

export const QUERY_GET_CLIENTS = 'SELECT id, org_name FROM client WHERE org_name LIKE ?';
export const QUERY_GET_ALL_CLIENTS = 'SELECT * FROM client';
export const GET_SUPPLIERS_CLIENTID = 'SELECT o.id, o.denomination FROM organisations as o LEFT JOIN client_supplier_relation as c ON c.supplier_id = o.id WHERE c.client_id = ? AND (denomination LIKE ? OR siret = ?)'
export const GET_SUPPLIERS = 'SELECT o.id, o.denomination FROM organisations as o LEFT JOIN client_supplier_relation as c ON c.supplier_id = o.id WHERE c.client_id = ? AND (denomination LIKE ? OR siret = ?)'
export const QUERY_GET_ADMIN = 'SELECT * from admins WHERE id = ? AND email = ? LIMIT 1';
export const QUERY_GET_DOCUMENTS = 'SELECT DISTINCT d.id, d.createdAt, d.filename, d.id, d.path, d.siren, d.category, d.uploadedBy, d.validityDate, d.state, o.denomination FROM `document` d INNER JOIN `organisations` o on d.siren = o.siren GROUP BY d.id, o.id, d.siren, o.denomination ORDER BY d.createdAt DESC;'
export const GET_DOCUMENT = 'SELECT * FROM document as d WHERE d.id = ?;';

export const GET_MONTHLY_CONFORMITY = 'SELECT * FROM supplier_conformity as sc WHERE sc.start_date = ?';
export const UPDATE_SUPPLIER_CONFORMITY = 'UPDATE supplier_conformity SET kbis=?,lnte=?,urssaf=?,kbis_expiration=?,urssaf_expiration=?,lnte_expiration=? WHERE siren=? AND start_date=?';

export const QUERY_GET_SUPPLIERS_USERS = 'SELECT s.name, s.lastname, s.created_at, s.client_id, s.org_id, s.email, s.validity_date, c.org_name, o.denomination FROM `suppliers` AS s LEFT JOIN `client` as c ON c.id = s.client_id LEFT JOIN `organisations` as o ON o.id = s.org_id;';
export const QUERY_GET_SUPPLIERS_USERS_OFFLIM = "SELECT s.name, s.lastname, s.created_at, s.client_id, s.org_id, s.email, s.validity_date, c.org_name, o.denomination FROM `suppliers` AS s LEFT JOIN `client` as c ON c.id = s.client_id LEFT JOIN `organisations` as o ON o.id = s.org_id LIMIT ? OFFSET ?";

export const INSERT_ALERT = 'INSERT INTO `client_preferences` (user_id, client_id, alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE alerts_state = ?, alert_valid_sup = ?, alert_invalid_sup = ?, alert_invalid_mail = ?, alert_frequency = ?';

export const FIND_ADMIN_BY_NAME_EMAIL = 'SELECT id,create_time,email,lastname,name,username,password FROM `admins` WHERE `username` = ? OR `email` = ? LIMIT 1';

export const GET_ALERTS_CLIENTS = 'SELECT u.organisation as client_id, cp.user_id, cp.alert_valid_sup, cp.alert_invalid_sup, cp.alert_invalid_mail, cp.alert_frequency, cp.alert_offline_supplier, u.organisation, u.name, u.lastname, u.email FROM client_preferences as cp LEFT JOIN `user` as u ON u.id = cp.user_id WHERE cp.alerts_state = 1 ';
export const GET_ALERTS_BIMONTHLY = 'SELECT u.organisation as client_id, cp.user_id, cp.alert_valid_sup, cp.alert_invalid_sup, cp.alert_invalid_mail, cp.alert_frequency, cp.alert_offline_supplier, u.organisation, u.name, u.lastname, u.email FROM client_preferences as cp LEFT JOIN suppliers as s ON s.id = cp.user_id WHERE cp.alerts_state = 1 ';
export const GET_ALERTS_MONTHLY = 'SELECT u.organisation as client_id, cp.user_id, cp.alert_valid_sup, cp.alert_invalid_sup, cp.alert_invalid_mail, cp.alert_frequency, cp.alert_offline_supplier, u.organisation, u.name, u.lastname, u.email FROM client_preferences as cp LEFT JOIN suppliers as s ON s.id = cp.user_id WHERE cp.alerts_state = 1 ';

export const UPDATE_METADATA = 'UPDATE `document` set state = ?, validityDate = ? WHERE id = ?';
export const UPDATE_DOC_TO_REPLACED = 'UPDATE `document` set state = 3 WHERE state=1 AND siren = ? AND category = ?;';

// ======== TO TEST ==========
export const ALERT_MAIL_DATA = 'SELECT DISTINCT csr.client_id, o.denomination, o.id, r.count as count, sc.kbis, sc.lnte, sc.urssaf, off_supp.off, sc.supplier_id FROM `organisations` as o INNER JOIN `client_supplier_relation` as csr ON o.id = csr.supplier_id LEFT JOIN `supplier_conformity` as sc ON (o.siren = sc.siren AND sc.start_date = ?), (SELECT COUNT(su.id) as off FROM `suppliers` as su WHERE su.client_id = ? AND su.last_connexion IS NULL) as off_supp, (SELECT COUNT(*) as count FROM `organisations` as org INNER JOIN `client_supplier_relation` as c ON org.id = c.supplier_id WHERE c.client_id = ?) as r WHERE csr.client_id = ?;';
export const INSERT_ACC_ACTIVATION = 'INSERT INTO `account_activation` (`user_id`, `token`, `expiration_time`) VALUES (?, ?, ?)'


// Conformity queries
export const GET_ALL_SUPPLIERS = 'SELECT * from organisations';
export const GET_ALL_USED_DOCS = 'SELECT d.id, d.siren, d.validityDate, dt.id as doc_id FROM `document` as d INNER JOIN `doc_types` as dt ON dt.name=d.category WHERE d.siren IN ( SELECT distinct siren from organisations ) AND d.state = 1;'
export const GET_DOCS_NEEDED = 'SELECT sdr.doc_id,sdr.org_id,sdr.client_id,o.siren,dt.name as doc_name FROM `supplier_doc_relation` as sdr INNER JOIN organisations as o ON sdr.org_id=o.id INNER JOIN doc_types as dt ON dt.id=sdr.doc_id WHERE org_id IN ( SELECT distinct id from organisations ) GROUP BY doc_id, client_id, org_id ORDER BY org_id;';
export const MASS_INSERT_CONFORMITY = 'INSERT INTO `supplier_conformity` (client_id, org_id, start_date, legal, comp) VALUES ?';