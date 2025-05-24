const express = require('express')
const router = express.Router()
const feedbackController = require('../Controllers/feedbackController')
const limiter = require('../middleware/rateLimit')
const feedbackValidation = require('../middleware/feedValidation')


router.use(limiter)
router.route('/')
    .post(feedbackValidation,feedbackController.submitFeedback)

module.exports = router