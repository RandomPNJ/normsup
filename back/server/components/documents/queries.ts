export const INSERT_DOC_METADATA = 'INSERT INTO `document` SET ?';

// export const UPDATE_SUPPLIER_CONFORMIATY = 'UPDATE supplier_conformity SET ? = ? WHERE supplier_id = ?';



export const UPSERT_SUPPLIER_CONF_KBIS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, kbis) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE kbis = ?, kbis_expiration = ?';
export const UPSERT_SUPPLIER_CONF_URS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, urssaf) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE urssaf = ?, urssaf_expiration = ?';
export const UPSERT_SUPPLIER_CONF_LNTE = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, lnte) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE lnte = ?, lnte_expiration = ?';