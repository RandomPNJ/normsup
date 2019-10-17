
export const QUERY_GET_ALERT_SETTINGS = 'SELECT alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency FROM `client_preferences` WHERE client_id = ?';

export const INSERT_ALERT = 'INSERT INTO `client_preferences` (client_id, alerts_state, alert_valid_sup, alert_invalid_sup, alert_invalid_mail, alert_frequency) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE alerts_state = ?, alert_valid_sup = ?, alert_invalid_sup = ?, alert_invalid_mail = ?, alert_frequency = ?';