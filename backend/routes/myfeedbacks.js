const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const feedbackController = require('../Controllers/feedbackController')

router.use(verifyJWT)

router.route('/')
    .get(feedbackController.getMyFeedbacks)

router.route('/single')
    .get(feedbackController.singleFeedback)
    
module.exports = router