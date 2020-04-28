export const QUERY_GET_USERS_OFFLIM = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` LEFT JOIN organisations AS o ON user.organisation = o.id WHERE organisation = ? LIMIT ? OFFSET ?';

// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` LEFT JOIN organisations AS o ON user.organisation = o.id WHERE organisation = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` LEFT JOIN organisations AS o ON user.organisation = o.id WHERE `organisation` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city, picture_url,ur.roleID,r.name AS rolename, o.denomination as companyName FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id  LEFT JOIN organisations AS o ON u.organisation = o.id WHERE u.organisation = ?';
export const QUERY_GET_USER = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` WHERE user.id = ? LIMIT 1';
export const GET_USER_ROLES = 'SELECT ur.userID, r.description, r.name FROM `user_roles` as ur INNER JOIN roles as r ON ur.roleID = r.id WHERE ur.userID = ?';

export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation, create_time,createdBy) values (?,?,?,?,?,?,?,?,?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';

export const FIND_USER_BY_NAME_EMAIL = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` LEFT JOIN organisations AS o ON user.organisation = o.id WHERE `username` = ? OR `email` = ? LIMIT 1';
export const FIND_USER_BY_ID = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user`  LEFT JOIN organisations AS o ON user.organisation = o.id WHERE user.id = ? LIMIT 1';
export const GET_CURRENT_USER_EMAIL = 'SELECT user.id,create_time,createdBy,email,lastname,name,organisation,username,password,user.address,user.phonenumber,user.postalCode,user.city, picture_url, o.denomination as companyName FROM `user` LEFT JOIN organisations AS o ON user.organisation = o.id WHERE user.id= ? AND `email` = ? LIMIT 1'
export const QUERY_MODIFY_USER = 'UPDATE `user` SET email = ?, lastname = ?, name = ?, user.address = ?, user.phonenumber = ?, user.postalCode = ?, user.city, picture_url = ? WHERE id = ?';
export const QUERY_MODIFY_PASSWORD = 'UPDATE `user` SET password = ? WHERE id = ?';

export const UPDATE_PROFILE_PIC = 'UPDATE `user` SET picture_url = ? WHERE id = ?';