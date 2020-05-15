export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation ,create_time,createdBy) values (?,?,?,?,?,?,?,?)';
export const INSERT_CLIENT = 'INSERT INTO `client` (org_name, address, postalCode, create_time, city, country) values (?, ?, ?, ?, ?, ?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';
export const INSERT_USER_PREFERENCES = 'INSERT INTO `client_preferences` (client_id,) VALUES (?)';
export const INSERT_ADMIN = 'INSERT INTO `admins` (name, lastname, email, password, username) values (?,?,?,?,?)';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city,ur.roleID,r.name AS rolename, c.org_name, c.id as org_id FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id LEFT JOIN `client` as c ON c.id = u.organisation';
export const QUERY_GET_USERS_OFFLIM = "";

export const QUERY_GET_CLIENTS = 'SELECT id, org_name FROM client WHERE org_name LIKE ?';
export const GET_SUPPLIERS_CLIENTID = 'SELECT o.id, o.denomination FROM organisations as o LEFT JOIN client_supplier_relation as c ON c.supplier_id = o.id WHERE c.client_id = ? AND (denomination LIKE ? OR siret = ?)'
export const GET_SUPPLIERS = 'SELECT o.id, o.denomination FROM organisations as o LEFT JOIN client_supplier_relation as c ON c.supplier_id = o.id WHERE c.client_id = ? AND (denomination LIKE ? OR siret = ?)'

export const QUERY_GET_SUPPLIERS_USERS = 'SELECT s.name, s.lastname, s.created_at, s.client_id, s.org_id, s.email, s.validity_date, c.org_name, o.denomination FROM `suppliers` AS s LEFT JOIN `client` as c ON c.id = s.client_id LEFT JOIN `organisations` as o ON o.id = s.org_id;';
export const QUERY_GET_SUPPLIERS_USERS_OFFLIM = "";

export const INSERT_ALERT = 'INSERT INTO `client_preferences` (client_id, alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE alerts_state = ?, alert_valid_sup = ?, alert_invalid_sup = ?, alert_invalid_mail = ?, alert_frequency = ?';

export const FIND_ADMIN_BY_NAME_EMAIL = 'SELECT id,create_time,email,lastname,name,username,password FROM `admins` WHERE `username` = ? OR `email` = ? LIMIT 1';