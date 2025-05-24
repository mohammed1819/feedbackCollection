const mongoose = require('mongoose')

const userSchema = mongoose.Schema(

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
        role: {
            type: String,
            default: "user"
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Company'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)