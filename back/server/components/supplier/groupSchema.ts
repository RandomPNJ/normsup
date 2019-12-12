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
    frequency: Joi.string().required(),
});