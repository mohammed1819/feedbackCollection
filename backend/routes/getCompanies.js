const express = require('express')
const router = express.Router()
const companyController = require('../Controllers/CompanyController') 

router.route('/')
    .get(companyController.getCompanies)

module.exports = router