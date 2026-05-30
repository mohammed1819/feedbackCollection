const Feed = require('../models/Feedback')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const { Parser } = require('json2csv')
const mongoose = require('mongoose')
const Company = require('../models/Company')
const sendEmail = require('../utils/sendEmail')

const submitFeedback = asyncHandler(async (req, res) => {
    const { message, rating, category } = req.body

    console.log(req.userid)
    const user = await User.findById(req.userid)
    console.log(user)

    if(!user){
    return res.status(401).json({message:'unauthorized'})
    }

    const newFeedback = new Feed({
        message: message.trim(),
        userID: req.userid ? req.userid : null,
        rating,
        category,
        companyId:user.companyId
    })
    console.log(newFeedback)

    const result = await newFeedback.save()

    res.status(201).json({ result })
})

const singleFeedback = asyncHandler(async(req,res)=>{

    console.log(req.query.id)
    const feedback = await Feed.findById(req.query.id)
    console.log(feedback)
    if(!feedback){
        return res.status(400).json({message:'Feedback not found'})
    }
   
    res.status(201).json({feedback})
})

const getFeedbacks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 3, search, rating, category } = req.query;
    const skip = (page - 1) * limit;
    
    const feedbacks = await Feed.find()
        .skip(skip)
        .limit(limit)
        .lean();
    
    let feedbacksWithData = await Promise.all(
        feedbacks.map(async (feedback) => {
            const email = await User.findById(feedback.userID).lean();
            return { ...feedback, email: email ? email.email : 'anonymous' };
        })
    );

    if (search) {
        feedbacksWithData = feedbacksWithData.filter((feedback) => 
            feedback.message.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (rating) {
        feedbacksWithData = feedbacksWithData.filter((feedback) => 
            feedback.rating >= Number(rating)
        );
    }

    if (category) {
        feedbacksWithData = feedbacksWithData.filter((feedback) => 
            feedback.category.includes(category)
        );
    }

    res.status(200).json({feedbacksWithData});
});


const getMyFeedbacks = asyncHandler(async(req,res)=>{
    const feedbacks = await Feed.find({userID:req.userid})
    if(!feedbacks || feedbacks.length===0){
        return res.status(200).json({message:'No feedbacks Found'})
    }
    res.status(201).json({feedbacks})
})

const getFeedbackStats = asyncHandler(async (req, res) => {

    const feedbacks = await Feed.find().lean()
    let averageRating = 0
    let ratedFeedbacks = 0
    let valuesObj = {}
    let anonymousCount = 0
    let authenticatedCount = 0
    const categories = Feed.schema.obj.category.enum;

    feedbacks.map((feedback) => {
        averageRating = averageRating + (feedback.rating ? feedback.rating : 0)
        if (feedback.rating) {
            ratedFeedbacks++
        }

        if (feedback.category) {
            feedback.category.map(category => {
                valuesObj[category] = (valuesObj[category] || 0) + 1
            })
        }

        if (!feedback.userID) {
            anonymousCount++
        } else {
            authenticatedCount++
        }
    })

    categories.forEach(category => {
        if (!valuesObj[category]) {
            valuesObj[category] = 0
        }
    })

    averageRating /= ratedFeedbacks

    const resObject = {
        "total": feedbacks.length,
        averageRating,
        "CategoryBreakdown": valuesObj,
        anonymousCount,
        authenticatedCount
    }

    res.json(resObject)

})


const getCSVFile = asyncHandler(async (req, res) => {
    const feedbacks = await Feed.find().lean()

    const feedbackswithUsers = await Promise.all(feedbacks.map(async (feedback) => {
        const email = await User.findById(feedback.userID).lean()
        return { ...feedback, email: email ? email.email : 'anonymous' }
    }))

    const newArr = feedbackswithUsers.map((feedback) => {
        return (
            {
                "message": feedback.message,
                "rating": feedback.rating || null,
                "category": feedback.category.join(', ') || null,
                email: feedback.email
            }
        )
    })



    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(newArr)

    res.header('Content-type', 'text/csv')
    res.attachment('feedback.csv')
    res.send(csv)
})

const getCompanyFeedbacks = asyncHandler(async(req,res)=>{
    const company = await Company.findOne({slug:req.params.slug})
    const feedbacks = await Feed.find({companyId:company._id})
    if(!feedbacks || !feedbacks.length){
        return res.status(404).json({message:'No feedbacks Found'})
    } 
    res.status(201).json({feedbacks})
})

const predefinedMessages = {
    "approved": "Thank you for your feedback! We appreciate your input and have marked this as approved. We will take action on your suggestion.",
    "rejected": "Thank you for your feedback. We have reviewed it and decided not to proceed with this suggestion at this time.",
    "resolved": "Thank you for reporting this issue. We have successfully resolved it and appreciate your help in improving our service.",
    "in_review": "Thank you for your feedback. We are currently reviewing your input and will get back to you soon."
}

const reviewFeedback = asyncHandler(async(req,res)=>{
    const { feedbackId, status, adminMessage } = req.body
    
    if(!feedbackId || !status){
        return res.status(400).json({message:'Feedback ID and status are required'})
    }

    const feedback = await Feed.findById(feedbackId).populate('userID')
    if(!feedback){
        return res.status(404).json({message:'Feedback not found'})
    }

    // Use custom message or predefined message
    const finalMessage = adminMessage?.trim() || predefinedMessages[status] || predefinedMessages["in_review"]

    // Update feedback
    feedback.status = status
    feedback.adminMessage = finalMessage
    feedback.reviewedAt = new Date()
    await feedback.save()

    // Send email to user if they are authenticated
    if(feedback.userID && feedback.userID.email){
        try{
            await sendEmail({
                to: feedback.userID.email,
                subject: `Your Feedback Has Been Reviewed - Status: ${status.toUpperCase()}`,
                text: finalMessage,
                html: `<p>Your feedback has been reviewed.</p><p><strong>Status:</strong> ${status.toUpperCase()}</p><p><strong>Message:</strong></p><p>${finalMessage}</p>`
            })
        }catch(err){
            console.log('Email sending failed:', err)
        }
    }

    res.status(200).json({message:'Feedback reviewed successfully', feedback})
})

module.exports = { submitFeedback, getFeedbacks, getFeedbackStats, getCSVFile, getMyFeedbacks, singleFeedback, getCompanyFeedbacks, reviewFeedback}