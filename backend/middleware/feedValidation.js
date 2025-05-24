const feedbackValidation = (req,res,next) =>{
        const {message,rating,category} = req.body
        if(!message || message.trim().length===0){
            return res.status(400).send({message:'Message for the feedback is required'})
        }
        if(message.trim().length>50){
            return res.status(400).send({message:'message length should be less than 50 letters'})
        }
        if(rating && ( rating>5 || rating < 0)){
            return res.status(400).json({message:'Rating should be in the range 1-5'})
        }
        if(category && (!Array.isArray(category))){
            return res.status(400).json({message:'category must be an array of Strings'})
        }
        next()
}

module.exports = feedbackValidation