import * as Joi from 'joi';

export const SupplierSchema = Joi.object({
    siret: Joi.string().required(),
    siren: Joi.string().required(),
    address: Joi.string().optional(),
    denomination: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    legalUnit: Joi.string().optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    dateCreation: Joi.string().optional()
});
