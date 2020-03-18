import * as Joi from 'joi';

export const RepresentativeSchema = Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    phonenumber: Joi.string().optional(),
    email: Joi.string().required()
});
