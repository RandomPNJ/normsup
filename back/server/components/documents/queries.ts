export const INSERT_DOC_METADATA = 'INSERT INTO `document` SET ?';

// export const UPDATE_SUPPLIER_CONFORMIATY = 'UPDATE supplier_conformity SET ? = ? WHERE supplier_id = ?';

export const GET_DOCUMENT = 'SELECT * FROM document as d WHERE d.id = ? AND d.client = ? ;';


export const UPSERT_SUPPLIER_CONF_KBIS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, kbis, start_date, end_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE kbis = ?, kbis_expiration = ?';
export const UPSERT_SUPPLIER_CONF_URS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, urssaf, start_date, end_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE urssaf = ?, urssaf_expiration = ?';
export const UPSERT_SUPPLIER_CONF_LNTE = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, lnte, start_date, end_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE lnte = ?, lnte_expiration = ?';