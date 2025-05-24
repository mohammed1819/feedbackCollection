const Feed = require('../models/Feedback')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const { Parser } = require('json2csv')

const submitFeedback = asyncHandler(async (req, res) => {
    const { message, rating, category } = req.body
    const newFeedback = new Feed({
        message: message.trim(),
        userID: req.userid ? req.userid : null,
        rating,
        category
    })

    const result = await newFeedback.save()

    res.status(201).json({ result })
})

const singleFeedback = asyncHandler(async(req,res)=>{

    const feedback = await Feed.findById(req.query.id)
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

module.exports = { submitFeedback, getFeedbacks, getFeedbackStats, getCSVFile, getMyFeedbacks ,singleFeedback}