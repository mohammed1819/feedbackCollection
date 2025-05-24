const asyncHandler = require('express-async-handler')
const Company = require('../models/Company')

const getCompanies = asyncHandler(async(req,res)=>{
    const companies = await Company.find()
    if(companies){
        res.status(201).json({companies})
    }
})

module.exports = {getCompanies}