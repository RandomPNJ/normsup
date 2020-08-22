
export const QUERY_GET_ALERT_SETTINGS = 'SELECT alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency, alert_offline_supplier as alert_offline_sup FROM `client_preferences` WHERE user_id = ?';

export const INSERT_ALERT = 'INSERT INTO `client_preferences` (user_id, alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency, alert_offline_supplier) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE alerts_state = ?, alert_valid_sup = ?, alert_invalid_sup = ?, alert_invalid_mail = ?, alert_frequency = ?, alert_offline_supplier=?';
