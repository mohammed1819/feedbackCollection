const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'Unauthorized'})
    }
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async(err,decoded)=>{
            if(err){
                return res.status(403).json({message:'Forbidden'})
            }
            req.email = decoded.UserInfo.email
            req.role = decoded.UserInfo.role
            req.userid = decoded.UserInfo.userid
            next()
        }
    ))
}

module.exports = verifyJWT