import * as Joi from 'joi';

export const GroupSchema = Joi.object({
    organisation: Joi.number().optional(),
    name: Joi.string().required(),
    description: Joi.string().allow("").optional(),
});

export const GroupRemindersSchema = Joi.object({
    group_id: Joi.number().required(),
    activated: Joi.number().allow(0, 1).required(),
    legal_docs: Joi.string().allow("").required(),
    comp_docs: Joi.string().allow("").required(),
    frequency: Joi.allow([Joi.string(), Joi.number()]).required(),
    client_id: Joi.allow([Joi.string(), Joi.number()]).optional(),
    next_reminder: Joi.date().required(),
    description: Joi.string().allow("").optional(),
    name: Joi.string().allow("").optional(),
    id: Joi.allow([Joi.string(), Joi.number()]).optional(),
    creation_time: Joi.date().optional(),
    last_reminder: Joi.date().optional(),
    spont_reminder: Joi.date().optional(),
});