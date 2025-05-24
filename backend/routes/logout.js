const express = require('express')
const router = express.Router()
const logoutController = require('../Controllers/logoutController')

router.route('/')
    .get(logoutController.logout)

module.exports = router