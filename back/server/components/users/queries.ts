export const QUERY_GET_USERS_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE organisation = ? LIMIT ? OFFSET ?';

// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE organisation = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE ` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city, picture_url,ur.roleID,r.name AS rolename FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id WHERE u.organisation = ?';
export const QUERY_GET_USER = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE `id` = ? LIMIT 1';
export const GET_USER_ROLES = 'SELECT ur.userID, r.description, r.name FROM `user_roles` as ur INNER JOIN roles as r ON ur.roleID = r.id WHERE ur.userID = ?';

export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation, create_time,createdBy) values (?,?,?,?,?,?,?,?,?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';

export const FIND_USER_BY_NAME_EMAIL = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,password,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE `username` = ? OR `email` = ? LIMIT 1';
export const FIND_USER_BY_ID = 'SELECT id,create_time,createdBy,email,lastname,name,organisation,username,password,address,phonenumber,postalCode,city, picture_url FROM `user` WHERE `id` = ? LIMIT 1';

export const QUERY_MODIFY_USER = 'UPDATE `user` SET email = ?, lastname = ?, name = ?, address = ?, phonenumber = ?, postalCode = ?, city, picture_url = ? WHERE id = ?';
export const QUERY_MODIFY_PASSWORD = 'UPDATE `user` SET password = ? WHERE id = ?';

export const UPDATE_PROFILE_PIC = 'UPDATE `user` SET picture_url = ? WHERE id = ?';