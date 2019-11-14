export const QUERY_GET_USERS_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,username,address,phonenumber,postalCode,city FROM `user` WHERE `client` = ? LIMIT ? OFFSET ?';

// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,username,address,phonenumber,postalCode,city FROM `user` WHERE `client` = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,username,address,phonenumber,postalCode,city FROM `user` WHERE `client` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.client,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city,ur.roleID,r.name AS rolename FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id WHERE u.client = ?';
export const QUERY_GET_USER = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,username,address,phonenumber,postalCode,city FROM `user` WHERE `id` = ?';

export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation, client ,create_time,createdBy) values (?,?,?,?,?,?,?,?,?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';

export const FIND_USER_BY_NAME_EMAIL = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,username,password,address,phonenumber,postalCode,city FROM `user` WHERE `username` = ? OR `email` = ? LIMIT 1';

export const QUERY_MODIFY_USER = 'UPDATE `user` SET email = ?, lastname = ?, name = ?, address = ?, phonenumber = ?, postalCode = ?, city = ? WHERE id = ?';
export const QUERY_MODIFY_PASSWORD = 'UPDATE `user` SET password = ? WHERE id = ?';