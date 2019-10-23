export const QUERY_GET_USERS_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,role,username FROM `user` WHERE `client` = ? LIMIT ? OFFSET ?';

// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,role,username FROM `user` WHERE `client` = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,role,username FROM `user` WHERE `client` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,role,username FROM `user` WHERE `client` = ?';


export const INSERT_USER = 'INSERT INTO `user` SET ?';


export const FIND_USER_BY_NAME_EMAIL = 'SELECT id,create_time,createdBy,email,lastname,name,client,organisation,role,username,password FROM `user` WHERE `username` = ? OR `email` = ? LIMIT 1';