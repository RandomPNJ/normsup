import * as Joi from 'joi';

export const AlertSchema = Joi.object({
    clientID: Joi.number().required(),
    alertState: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alertValidSup: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alertInvalidSup: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alertInvalidMail: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alertFrequency: Joi.string().allow("DAILY", "WEEKLY", "EVERYOTHERDAY").required(),
});
