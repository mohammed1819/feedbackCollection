const express = require('express')
const router = express.Router()
const CompanyRegister = require('../Controllers/CompanyRegister')

router.route('/')
    .get(CompanyRegister.getToken)
    .post(CompanyRegister.confirmToken)

module.exports = router
