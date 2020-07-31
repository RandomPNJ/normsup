import * as Joi from 'joi';

export const ClientSchema = Joi.object({
    org_name: Joi.string().required(),
    address: Joi.string().allow('').optional(),
    postalCode: Joi.number().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    create_time: Joi.allow(Joi.string(), Joi.number()).optional()
});
