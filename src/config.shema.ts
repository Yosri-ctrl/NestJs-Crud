import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_PORT: Joi.number().required().default(5432),
  TYPEORM_SECRET: Joi.string().required(),
});
