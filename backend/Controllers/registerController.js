const User = require('../models/User')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const Company = require('../models/Company')

const handleNewUser = asyncHandler(async (req, res) => {
    const { email, pwd, role, code} = req.body
    
    if (!email) {
        return res.status(400).json({ message: 'Email is Required' })
    }
    if (!pwd) {
        return res.status(400).json({ message: 'Passwoord is Required' })
    }
    if (!role) {
        return res.status(400).json({ message: 'role is Required' })
    }
    if (!code) {
        return res.status(400).json({ message: 'select a company' })
    }
    
    const company = await Company.findOne({companyCode:code})

    let duplicate
    let savedUser
    let message 

    if(role=='admin'){
        duplicate = await Admin.findOne({email})
        if(duplicate){
            return res.status(409).json({ message: 'Email already Exists'})
        }
        const hashedPassword = await bcrypt.hash(pwd, 10)

        const newAdmin = new Admin({
            email,
            "password":hashedPassword,
            "role":role,
            companyId:company._id
        })
        savedUser = await newAdmin.save()
        message = 'Admin created Successfully'

    }else{

        duplicate = await User.findOne({email})
        if (duplicate) {
            return res.status(409).json({ message: 'Email already Exists' })
        }
        const hashedPassword = await bcrypt.hash(pwd,10)

        const newUser = new User({
        email,
        "password": hashedPassword,
        "role": role,
        companyId:company._id
    })

    savedUser = await newUser.save()

    message = 'User created successfully'
    }

    const accessToken = jwt.sign({
        "UserInfo": {
            "email": savedUser.email,
            "role":savedUser.role,
            "userid": savedUser._id
        },
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
    )

    const refreshToken = jwt.sign(
        {
            "UserInfo": {
                "email": savedUser.email,
                "roles":savedUser.roles,
                "userid": savedUser._id
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )


    savedUser.refreshToken = refreshToken
    await savedUser.save()

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(201).json({ message: message , accessToken})

})

module.exports = { handleNewUser }