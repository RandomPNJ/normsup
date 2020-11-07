export const INSERT_DOC_METADATA = 'INSERT INTO `document` SET ?';

export const GET_DOCUMENT = 'SELECT * FROM document as d WHERE d.id = ? AND d.client = ? ;';
export const GET_DOCUMENTS = 'SELECT path, filename, validityDate FROM document as d WHERE  d.createdAt BETWEEN ? AND ? ';
export const GET_DOCUMENTS2 = 'SELECT path, filename, validityDate FROM document as d WHERE d.client = ? AND d.validityDate BETWEEN CAST(? AS DATE) AND CAST(? AS DATE) ';


export const UPSERT_SUPPLIER_CONF_KBIS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, kbis, start_date, kbis_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE kbis = ?, kbis_expiration = ?';
export const UPSERT_SUPPLIER_CONF_URS = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, urssaf, start_date, urssaf_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE urssaf = ?, urssaf_expiration = ?';
export const UPSERT_SUPPLIER_CONF_LNTE = 'INSERT INTO `supplier_conformity` (client_id, supplier_id, lnte, start_date, lnte_expiration) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE lnte = ?, lnte_expiration = ?';

export const GET_ORG_INFO = 'SELECT * from organisations WHERE id = ?';
export const GET_ORGS_INFO = 'SELECT * from organisations as o INNER JOIN client_supplier_relation as csr ON o.id = csr.supplier_id AND csr.client_id = ? WHERE id IN ';
export const GET_ORGS_INFO_FROM_GROUP = 'SELECT * FROM `groups` as g INNER JOIN group_members as gm ON g.id=gm.group_id INNER JOIN organisations as o ON gm.member_id=o.id INNER JOIN client_supplier_relation as csr ON o.id = csr.supplier_id AND csr.client_id = ? WHERE g.id IN ';