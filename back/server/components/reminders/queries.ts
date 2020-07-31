export const GET_SUPPLIER_INFO = 'SELECT o.id, o.siret, o.address, o.siren, o.denomination, o.country, o.city, o.dateCreation, o.legalUnit, o.postalCode, r.name, r.lastname, r.phonenumber, r.email, r.creation_date as repres_creation, r.added_by as repres_added_by, r.client_id as repres_client_id, c.creationDate as createdAt, r.gender FROM `organisations`  AS o INNER JOIN `client_supplier_relation` as c ON o.id = c.supplier_id  LEFT OUTER JOIN `representatives` as r ON r.organisation_id = o.id LEFT OUTER JOIN `document` as d ON d.client=? WHERE o.id=? LIMIT 1';

export const DAILY_REMINDERS = 'SELECT o.denomination, r.client_id, r.name as represName, r.lastname as represLastname, r.gender, r.email, gr.last_reminder, gr.frequency, gm.group_id, o.id FROM group_reminders as gr INNER JOIN group_members as gm ON gm.group_id = gr.group_id INNER JOIN organisations as o ON o.id = gm.member_id LEFT JOIN representatives as r ON o.id = r.organisation_id WHERE DATE_ADD(gr.last_reminder, INTERVAL gr.frequency DAY) <= ?;';

export const UPDATE_REMINDERS = 'UPDATE normsup.group_reminders as gr SET gr.last_reminder = ?, gr.next_reminder = DATE_ADD(?, INTERVAL gr.frequency DAY) WHERE ';

export const INSERT_REMIND_HISTORY = 'INSERT INTO `group_reminders_history` (client_id, group_id, status, supplier_id) VALUES ?';

export const GROUP_TO_REMIND = 'SELECT o.added_by_org as client_id, o.denomination, r.client_id, r.name as represName, r.lastname as represLastname, r.gender, r.email, gr.last_reminder, gr.frequency, gm.group_id, o.id FROM group_reminders as gr INNER JOIN group_members as gm ON gm.group_id = gr.group_id INNER JOIN organisations as o ON o.id = gm.member_id LEFT JOIN representatives as r ON o.id = r.organisation_id WHERE gr.group_id = ? AND o.added_by_org = ?';

export const UPDATE_SPONT_REMIND = 'UPDATE organisations SET spont_reminder = ? WHERE id = ?'

export const UPDATE_GRP_SPONT_REMINDER = 'UPDATE group_reminders as gr SET gr.spont_reminder = ? WHERE '