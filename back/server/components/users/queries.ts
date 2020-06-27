export const QUERY_GET_USERS_OFFLIM = 'SELECT user.id,user.create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user` LEFT JOIN client AS c ON user.organisation = c.id WHERE organisation = ? LIMIT ? OFFSET ?';


export const QUERY_GET_USERS_NOTADMIN = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city, picture_url,ur.roleID,r.name AS rolename, c.org_name as companyName FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id  LEFT JOIN client AS c ON u.organisation = c.id WHERE u.organisation = ? AND u.createdBy = ?';
export const QUERY_GET_USERS_NOTADMIN_OFFLIM = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city, picture_url,ur.roleID,r.name AS rolename, c.org_name as companyName FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id  LEFT JOIN client AS c ON u.organisation = c.id WHERE u.organisation = ? AND u.createdBy = ? LIMIT ? OFFSET ?';


// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT user.id,user.create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user` LEFT JOIN client AS c ON user.organisation = c.id WHERE organisation = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT user.id,u.create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user` LEFT JOIN client AS c ON user.organisation = c.id WHERE `organisation` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city, picture_url,ur.roleID,r.name AS rolename, c.org_name as companyName FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id  LEFT JOIN client AS c ON u.organisation = c.id WHERE u.organisation = ?';
export const QUERY_GET_USER = 'SELECT user.id,user.create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user` LEFT JOIN client AS c ON user.organisation = c.id  WHERE user.id = ? LIMIT 1';
export const GET_USER_ROLES = 'SELECT ur.userID, r.description, r.name FROM `user_roles` as ur INNER JOIN roles as r ON ur.roleID = r.id WHERE ur.userID = ?';

export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation, u.create_time,createdBy) values (?,?,?,?,?,?,?,?,?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';

export const FIND_USER_BY_NAME_EMAIL = 'SELECT user.id,user.create_time,createdBy,email,lastname,user.name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName,ur.roleID,r.name AS rolename FROM `user` LEFT JOIN client AS c ON user.organisation = c.id LEFT JOIN `user_roles` AS ur ON user.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id WHERE `username` = ? OR `email` = ? LIMIT 1';
export const FIND_USER_BY_ID = 'SELECT user.id,user.create_time,createdBy,email,lastname,name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user`  LEFT JOIN client AS c ON user.organisation = c.id WHERE user.id = ? LIMIT 1';
export const GET_CURRENT_USER_EMAIL = 'SELECT user.id,user.create_time,createdBy,email,lastname,name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, c.org_name as companyName FROM `user` LEFT JOIN client AS c ON user.organisation = c.id WHERE user.id= ? AND `email` = ? LIMIT 1'
export const QUERY_MODIFY_USER = 'UPDATE `user` SET email = ?, lastname = ?, name = ?, address = ?, phonenumber = ?, postalCode = ?, city = ?, picture_url = ? WHERE id = ?';
export const QUERY_MODIFY_PASSWORD = 'UPDATE `user` SET password = ? WHERE id = ?';

export const UPDATE_PROFILE_PIC = 'UPDATE `user` SET picture_url = ? WHERE id = ?';