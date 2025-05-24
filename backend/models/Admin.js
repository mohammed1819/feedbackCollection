const mongoose = require('mongoose')

const adminSchema = mongoose.Schema(

    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            },
        refreshToken: {
            type: String
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        role: {
            type: String,
            default:"admin"
        },
        companyId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Company'
        }
    },
   
)

module.exports = mongoose.model('Admin', adminSchema)