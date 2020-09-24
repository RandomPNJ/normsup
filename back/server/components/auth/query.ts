export const CHECK_EMAIL_EXIST = 'SELECT * FROM user as u WHERE u.email = ?';
export const ACTIVATE_ACCOUNT = 'UPDATE `account_activation` as aa SET aa.activated = ? WHERE aa.token = ?';
export const RESET_ACTIVATION_EXPIRATION = 'UPDATE `account_activation` as aa SET aa.expiration_time = ?, aa.token = ? WHERE aa.user_id = ?';

export const CHECK_ACTIVATION = 'SELECT * from `account_activation` as aa WHERE aa.token = ? LIMIT 1';
export const CHECK_GENERATION = 'SELECT s.email, s.org_id, s.gender, o.denomination, aa.token, aa.activated, aa.expiration_time, aa.user_id from `suppliers` as s INNER JOIN `account_activation` as aa ON s.id=aa.user_id INNER JOIN `organisations` as o on s.org_id=o.id WHERE s.email = ?';

export const INSERT_RESET_PASSWORD = 'INSERT INTO `reset_password` (user_id, type, token) VALUES (?,?,?)'