const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const companyController = require('../Controllers/CompanyController')

router.use(verifyJWT)

router.route('/')
    .get(companyController.getCompanyUsers)

module.exports = router