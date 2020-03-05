export const INSERT_USER = 'INSERT INTO `user` (name, lastname, email, password, username, organisation, client ,create_time,createdBy) values (?,?,?,?,?,?,?,?,?)';
export const INSERT_CLIENT = 'INSERT INTO `client` (org_name, address, postalCode, create_time, city, country) values (?, ?, ?, ?, ?, ?)';
export const INSERT_ROLE = 'INSERT INTO `user_roles` (userID, roleID) VALUES (?, ?)';
export const QUERY_GET_USERS = 'SELECT u.id,u.create_time,u.createdBy,u.email,u.lastname,u.name,u.client,u.organisation,u.username,u.address,u.phonenumber,u.postalCode,u.city,ur.roleID,r.name AS rolename FROM `user` AS u LEFT JOIN `user_roles` AS ur ON u.id = ur.userID LEFT JOIN `roles` AS r ON ur.roleID = r.id';
export const QUERY_GET_USERS_OFFLIM = "";