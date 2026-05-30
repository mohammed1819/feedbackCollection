const User = require('../models/User')
const Admin = require('../models/Admin')
const Company = require('../models/Company')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const refresh = asyncHandler (async (req,res) =>{

    const cookies = req.cookies

    if(!cookies?.jwt){
        return res.status(401).json({message:'Unauthorized'})
    }
    
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({refreshToken}) || await Admin.findOne({refreshToken})

    if(!foundUser){
        return res.status(403).json({message:'Forbidden jutsu'})
    }

    jwt.verify(cookies.jwt,process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err,decoded)=>{
            if(err){
                return res.status(403).json({message:'Forbidden ninja'})
            }
            if(foundUser.email !== decoded.UserInfo.email){
                return res.status(403).json({message:'Forbidden village'})
            }
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username":foundUser.email,
                        "role":foundUser.role,
                        "userid":foundUser._id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'10s'}
            )
            const company = await Company.findById(foundUser.companyId)
        
            res.json({accessToken , slug:company.slug, role:foundUser.role})
        }
    ))

})
module.exports = refresh