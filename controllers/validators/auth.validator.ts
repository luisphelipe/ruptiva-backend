import Joi from 'joi'

const signup_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

export default signup_schema
