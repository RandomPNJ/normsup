export const INSERT_DOC_METADATA = 'INSERT INTO `document` SET ?';

// export const UPDATE_SUPPLIER_CONFORMIATY = 'UPDATE supplier_conformity SET ? = ? WHERE supplier_id = ?';

export const UPSERT_SUPPLIER_CONFORMIATY = 'INSERT INTO `supplier_conformity` (supplier_id, ?) VALUES (?, ?) ON DUPLICATE KEY UPDATE ? = ?';