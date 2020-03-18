import * as Joi from 'joi';

export const UserSchema = Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().optional().allow(''),
    email: Joi.string().required(),
    password: Joi.string().optional(),
    role: Joi.string().optional().allow(''),
    create_time: Joi.string().optional().allow(''),
    client: Joi.number(),
    createdBy: Joi.string().optional(),
});


export const SupplierUserSchema = Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().optional().allow(''),
    email: Joi.string().required(),
    password: Joi.string().optional(),
    created_at: Joi.string().optional().allow(''),
    client_id: Joi.number(),
    org_id: Joi.number(),
    createdBy: Joi.string().optional(),
});
