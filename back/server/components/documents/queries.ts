export const INSERT_DOC_METADATA = 'INSERT INTO `document` SET ?';

export const GET_DOCUMENT = 'SELECT * FROM document as d WHERE d.id = ? AND d.client = ? ;';
export const GET_DOCUMENTS = 'SELECT path, filename, validityDate FROM document as d WHERE d.client = ? AND d.createdAt BETWEEN ? AND ? ';
export const GET_DOCUMENTS2 = 'SELECT path, filename, validityDate FROM document as d WHERE d.client = ? AND d.validityDate BETWEEN CAST(? AS DATE) AND CAST(? AS DATE) ';


export const UPSERT_SUPPLIER_CONF_KBIS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, kbis, start_date, kbis_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE kbis = ?, kbis_expiration = ?';
export const UPSERT_SUPPLIER_CONF_URS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, urssaf, start_date, urssaf_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE urssaf = ?, urssaf_expiration = ?';
export const UPSERT_SUPPLIER_CONF_LNTE = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, lnte, start_date, lnte_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE lnte = ?, lnte_expiration = ?';

export const GET_ORG_INFO = 'SELECT * from organisations WHERE id = ?';