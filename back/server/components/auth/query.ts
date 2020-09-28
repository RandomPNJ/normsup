export const CHECK_EMAIL_EXIST = 'SELECT * FROM user as u WHERE u.email = ?';
export const ACTIVATE_ACCOUNT = 'UPDATE `account_activation` as aa SET aa.activated = ? WHERE aa.token = ?';
export const RESET_ACTIVATION_EXPIRATION = 'UPDATE `account_activation` as aa SET aa.expiration_time = ?, aa.token = ? WHERE aa.user_id = ?';

export const CHECK_ACTIVATION = 'SELECT * from `account_activation` as aa WHERE aa.token = ? LIMIT 1';
export const CHECK_GENERATION = 'SELECT s.email, s.org_id, s.gender, o.denomination, aa.token, aa.activated, aa.expiration_time, aa.user_id from `suppliers` as s INNER JOIN `account_activation` as aa ON s.id=aa.user_id INNER JOIN `organisations` as o on s.org_id=o.id WHERE s.email = ?';

export const INSERT_RESET_PASSWORD = 'INSERT INTO `reset_password` (user_id, type, token) VALUES (?,?,?)';

export const CHECK_RESET_PWD_TOKEN='SELECT COUNT(*) as count, user_id FROM `reset_password` as rp WHERE rp.token = ? AND rp.date IS NULL ';

export const CHANGE_PASSWORD='UPDATE `user` as u SET u.password = ? WHERE id = ?';
export const RESET_DONE='UPDATE `reset_password` as rp SET rp.date = ? WHERE rp.token = ?';
export const FIND_USER_BY_EMAIL = 'SELECT * FROM `user` WHERE `email` = ? LIMIT 1';
export const CHANGE_PASSWORD_HISTORY='INSERT INTO `password_modifications` (user_id) VALUES (?)'