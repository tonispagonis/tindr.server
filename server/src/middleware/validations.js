const Joi = require('joi')
const userModel = require('../models/userModel')

module.exports = {

  validateRegistration: async (req, res, next) => {
    const userExists = await userModel.findOne({ username: req.body.username })
    if (userExists) {
      return res.send({ error: true, message: 'Unavailable username', data: null })
    }
    
    const schema = Joi.object({
      username: Joi.string().min(3).max(20).required(),
      password1: Joi.string().min(5).max(20).required(),
      password2: Joi.string().min(5).max(20).required(),
      city: Joi.string().min(3).max(20).required(),
      sex: Joi.string().required(),
      age: Joi.number().min(18).max(99).required()
    })
    
    try {
      const result = await schema.validateAsync(req.body, { abortEarly: false })
      if (result.password1 === result.password2) {
        next()
      } else {
        res.send({ error: true, message: 'Passwords must match'})
      }
    } catch (error) {
      return res.send({ error: true, message: error.details[0].message })
    }
  },

  validateLogin: async (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().min(3).max(20).required(),
      password: Joi.string().min(5).max(20).required()
    })
    try {
      const result = await schema.validateAsync(req.body, { abortEarly: false })
      if (result) {
        next()
      } else {
        throw new Error('Username or password is incorrect')
      }
    } catch (error) {
      return res.send({ error: true, message: error.details[0].message })
    }
  }
}