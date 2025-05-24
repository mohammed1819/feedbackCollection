const express = require('express')
const router = express.Router()
const CompanyRegister = require('../Controllers/CompanyRegister')

router.route('/')
    .post(CompanyRegister.registerCompany)


module.exports = router