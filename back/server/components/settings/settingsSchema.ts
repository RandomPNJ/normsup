import * as Joi from 'joi';

export const AlertSchema = Joi.object({
    client_id: Joi.number().optional(),
    alerts_state: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alert_valid_sup: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alert_invalid_sup: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alert_invalid_mail: Joi.allow(Joi.boolean(), Joi.string()).required(),
    alert_frequency: Joi.string().allow("DAILY", "WEEKLY", "EVERYOTHERDAY").required(),
});
