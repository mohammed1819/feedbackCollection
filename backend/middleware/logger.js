const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFilename) => {
    const dateTime = format(new Date(), 'yyyyMMdd\t hh:mm:ss')
    const logString = `${message}\t${dateTime}\t${uuid()}\n`
    try {

        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFilename), logString)
    } catch (err) {
        console.log(err)
    }
}


const logger = (req, res, next) => {
    const message = `${req.method}\t${req.path}\t${req.headers.origin}`
    logEvents(message, 'reqLog.txt')
    next()
}

module.exports = {logger,logEvents}