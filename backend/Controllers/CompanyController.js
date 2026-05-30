const asyncHandler = require('express-async-handler')
const Company = require('../models/Company')
const Admin = require('../models/Admin')
const User = require('../models/User')

const getCompanies = asyncHandler(async(req,res)=>{
    const companies = await Company.find()
    if(companies){
        res.status(201).json({companies})
    }
})

const getCompanyUsers = asyncHandler(async(req,res)=>{
    const admin = await Admin.findById(req.userid)
    console.log(admin)
    if(!admin){
        return res.status(401).json({message:'Unauthorized'})
    }
    const users = await User.find({companyId : admin.companyId})
    console.log(users,users.length)
    if(!users || !users.length){
        return res.status(404).json({message:'No users found'})
    }
    res.status(201).json({users,count:users.length})
})

module.exports = {getCompanies,getCompanyUsers}