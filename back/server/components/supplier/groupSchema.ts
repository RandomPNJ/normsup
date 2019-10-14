import * as Joi from 'joi';

export const GroupSchema = Joi.object({
    organisation: Joi.number().optional(),
    name: Joi.string().required(),
    description: Joi.string().allow("").optional(),
});
