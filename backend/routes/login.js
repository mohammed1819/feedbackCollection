const express = require('express')
const router = express.Router()
const loginController = require('../Controllers/loginController')

router.route('/')
    .post(loginController.handleUserLogin)

module.exports = router