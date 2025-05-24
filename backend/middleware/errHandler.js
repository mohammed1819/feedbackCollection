const {logEvents} = require('./logger')

const errHandler = (err,req,res,next) =>{
    const message = `${err.name}\t${err.message}\t${req.method}\t${req.path}`
    logEvents(message,'errLog.txt')
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)

    res.json({message:err.message})
}

module.exports = errHandler