const mongoose = require('mongoose')

const companySchema = mongoose.Schema(
    {
    Name: {
        type: String,
        required: true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    industry: {
        type: String,
        enum: [
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "E-commerce",
            "Hospitality",
            "Real Estate",
            "Government",
            "Other"
        ],
        default:"Other"
    },
    registeredAt:{
        type:Date,
        default:Date.now
    },
    companyCode:{
        type:String,
        unique:true,
    },
    companyMail:{
        type:String,
        required:true,
        unique:true,
    },
    emailVerified:{
        type:Boolean,
        default:false
    }
}
)

module.exports = mongoose.model('Company',companySchema)