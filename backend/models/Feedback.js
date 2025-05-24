const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema(
    {
        message:{
            type:String,
            required:true
        },
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            default:null,
            ref:'User'
        },
        submittedAt:{
            type:Date,
            default:Date.now
        },
        rating:{
            type:Number,
            min:0,
            max:5,
            default:null
        },
        category:{
            type:[String],
            enum:["bug","feature-request","ui","content","other"],
            default:['other']
        },
        status:{
            type:String,
            enum:["pending,in_review,approved,rejected,resolved"],
            default:"pending"
        }
    }
)

module.exports = mongoose.model('Feed',feedbackSchema)