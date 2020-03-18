export const GET_USER = 'SELECT username, email, name, lastname, organisation, createdBy, phonenumber, address, postalCode, city, picture_url FROM `user` WHERE id = ? LIMIT 1';
