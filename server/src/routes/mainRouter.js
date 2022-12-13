const express = require('express')
const router = express.Router()
const { register, logIn, logOut } = require('../controllers/mainController')
const { validateRegistration, validateLogin } = require('../middleware/validations')

router.post('/register', validateRegistration, register)
router.post('/login', validateLogin, logIn)

router.get('/logout', logOut)

module.exports = router