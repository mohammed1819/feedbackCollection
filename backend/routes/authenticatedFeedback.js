const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const rolesList = require('../config/rolesList')
const verifyRoles = require('../middleware/verifyRoles')
const feedbackController = require('../Controllers/feedbackController')
const feedbackValidation = require('../middleware/feedValidation')

router.use(verifyJWT)



router.route('/')
    .post(feedbackValidation, feedbackController.submitFeedback)
    .get(verifyRoles(rolesList.Admin), feedbackController.getFeedbacks)

router.route('/stats')
    .get(verifyRoles(rolesList.Admin), feedbackController.getFeedbackStats)

router.route('/export/csv')
    .get(feedbackController.getCSVFile)

module.exports = router