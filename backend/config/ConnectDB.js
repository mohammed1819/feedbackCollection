const mongoose = require('mongoose')

const ConnectDB = async () => {
    try{
        mongoose.connect(process.env.DATABASE_URI)
    }catch(err){
        console.log(err)
    }
}
module.exports = ConnectDB
