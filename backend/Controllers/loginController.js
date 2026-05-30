const User = require('../models/User')
const Admin = require('../models/Admin')
const Company = require('../models/Company')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const asyncHandler = require('express-async-handler')

const handleUserLogin = asyncHandler(async (req, res) => {
    const { email, pwd, role } = req.body


    if (!email) {
        return res.status(400).json({ message: 'Email is Required' })
    }
    if (!pwd) {
        return res.status(400).json({ message: 'Passwoord is Required' })
    }
    if (!role) {
        return res.status(400).json({ message: 'role is Required' })
    }


    let foundUser

    if(role == 'admin'){
            
        foundUser = await Admin.findOne({email})
        if(!foundUser){
            return res.status(404).json({ message: 'Admin Not Found' })
        }
        const match = await bcrypt.compare(pwd, foundUser.password)

          if (!match) {
        return res.status(401).send({ message: 'Unauthorized' })
    }

    }else{
        foundUser = await User.findOne({ email })
       
        if (!foundUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        const match = await bcrypt.compare(pwd, foundUser.password)
    
        if (!match) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
    }


    const accessToken = jwt.sign({
        "UserInfo": {
            "email": foundUser.email,
            "role":foundUser.role,
            "userid": foundUser._id
        },
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
    )

   

    const refreshToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email,
                "role":foundUser.role,
                "userid": foundUser._id
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    const company = await Company.findById(foundUser.companyId)

    foundUser.refreshToken = refreshToken
    await foundUser.save()

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 })

    res.status(201).json({ accessToken , slug : company.slug })

})

module.exports = { handleUserLogin }