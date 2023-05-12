import Joi from 'joi';

export const UsersSchema = Joi.object({
  login: Joi.string().required().messages({
    'string.empty': `"login" cannot be an empty field`,
    'any.required': `"login" is a required field`
  }),
  password: Joi.string().regex(/^[A-Za-z]+\d+.*$/).message('Password must include letters and numbers').required(),
  age: Joi.number().less(130).greater(4).required().messages({
    'number.less': 'Age must be less than 130',
    'number.greater': 'Age must be greater than 4'
  })
})
