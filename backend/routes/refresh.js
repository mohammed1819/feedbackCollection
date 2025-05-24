const express = require('express')
const router = express.Router()
const refresh = require('../Controllers/refreshController')


router.route('/')
    .get(refresh)

module.exports = router
