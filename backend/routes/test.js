const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
    .get(verifyJWT,(req,res)=>{
        res.send({message:'hi'})
    })

module.exports = router