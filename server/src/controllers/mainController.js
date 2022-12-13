/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt')
const uid = require('uid-safe')
const userModel = require('../models/userModel')

module.exports = {

  register: async (req, res) => {
        const { username, password1, city, sex, age } = req.body
        const hash = await bcrypt.hash(password1, 10)
        const secret = uid(25)
        const user = new userModel({ 
          username,
          password: hash,
          city,
          sex,
          age
        })
        await user.save()
        req.session.user = user
        res.send({ error: false, message: 'Signed up', data: user })
  },

  logIn: async (req, res) => {
        const { username, password } = req.body
        const user = await userModel.findOne({ username })
        if (!user) return res.send({ error: true, message: 'User does not exist', data: null })

        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword) return res.send({ error: true, message: 'Incorrect password', data: null })

        req.session.user = username
        res.send({ error: false, message: 'Logged in', data: user })
  },

  logOut: async (req, res) => {
        req.session.destroy()
        res.send({ message: 'Logged out' })
        console.log(req)
  }

  
      
    
}
