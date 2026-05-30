const express = require('express')
const router = express.Router()
const feedbackController = require('../Controllers/feedbackController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)


router.route('/:slug')
    .get(feedbackController.getCompanyFeedbacks)

router.route('/:slug/review')
    .patch(feedbackController.reviewFeedback)

module.exports = router