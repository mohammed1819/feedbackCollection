const Company = require('../models/Company')
const asyncHandler = require('express-async-handler')
const sendEmail = require('../utils/sendEmail')

const url = 'http://localhost:5173/verify'


function generateCompanyCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}


const registerCompany = asyncHandler(async (req, res) => {
    const { Name, slug, industry, mail } = req.body
    console.log(req.body)
    if (!Name || !slug || !industry || !mail) {
        return res.status(400).json({ message: 'All the credenntials are required' })
    }
    const duplicate = (await Company.findOne({ mail })) || (await Company.findOne({ slug })) || (await Company.findOne({ Name }))
    if (duplicate) {
        return res.status(400).json({ message: 'Company already exists' })
    }
    const slugRegex = /[^a-zA-Z0-9\s]/g

    const Slug = slug.toLowerCase().replace(slugRegex, '').trim().replace(/\s+/g, '-')

    const code = generateCompanyCode()

    const newCompany = new Company({
        Name,
        slug: Slug,
        industry,
        companyCode: code,
        companyMail: mail
    })
    const result = await newCompany.save()

    if (result) {
        await sendEmail({
            to: mail,
            subject: 'Welcome to Feedback App!',
            text: `Your company was registered successfully. Click this link to confirm it was you and then use the confirmation Code to Register 
                ${url}?token=${code}`,
            html: `<p>Your company was registered successfully.</p><p><strong>Click the link to confirm and get the code for Signup <a href="${url}?token=${code}">Click</a></p>`
        })
        res.status(201).json({ success: 'Company registered Successfully' })
    }
})

const getToken = asyncHandler(async(req,res)=>{

    const param = req.query.token
    console.log(param)

    const company = await Company.findOne({companyCode:param})
    const token = company.companyCode

    if(!token){
        return res.status(500).json({message:'Error try again'})
    }
    res.status(201).json({token})
})

const confirmToken = asyncHandler(async(req,res)=>{
    const {statetoken} = req.body
    console.log(req.body)
    console.log(statetoken) 
    const company = await Company.findOne({companyCode:statetoken})
    if(!company){
        return res.status(500).json({message:'Server Error try again'})
    }
    company.emailVerified = true
    await company.save()
    res.status(200).json({success:'Confirmed Successfully'})
})

module.exports = { registerCompany ,getToken , confirmToken}