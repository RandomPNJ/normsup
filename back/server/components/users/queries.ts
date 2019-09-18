export const QUERY_GET_USERS_OFFLIM = 'SELECT * FROM `user` WHERE `main_org` = ? LIMIT ? OFFSET ?';

// TODO : Change so that we only get needed columns
export const QUERY_GET_USERS_GROUP_OFFLIM = 'SELECT * FROM `user` WHERE `main_org` = ? AND `group` = ? LIMIT ? OFFSET ?';
export const QUERY_GET_USERS_GROUP = 'SELECT * FROM `user` WHERE `main_org` = ? AND `group` = ?';
export const QUERY_GET_USERS = 'SELECT * FROM `user` WHERE `main_org` = ?';


export const INSERT_USER = 'INSERT INTO `user` SET ?';


export const FIND_USER_BY_NAME_EMAIL = 'SELECT * FROM `user` WHERE `username` = ? OR `email` = ? LIMIT 1';