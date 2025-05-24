require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser')
const ConnectDB = require('./config/ConnectDB')
const PORT = process.env.PORT || 3500 
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./middleware/corsOptions')
const errHandler = require('./middleware/errHandler')
const {logger} = require('./middleware/logger')



ConnectDB()

app.use(cors(corsOptions))
app.use(logger)
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views','index.html'))
});


app.use('/signup',require('./routes/register'))
app.use('/login',require('./routes/login'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/logout'))
app.use('/anonymousfeedback',require('./routes/anonymousFeedback'))
app.use('/company-register',require('./routes/companyroutes'))
app.use('/confirmCode',require('./routes/confirmRoute'))
app.use('/companies',require('./routes/getCompanies'))

app.use('/test',require('./routes/test'))

app.use('/feedback',require('./routes/authenticatedFeedback'))
app.use('/myfeedbacks',require('./routes/myfeedbacks'))



app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message:'Resource Requested is Not Found'})
    }else{
        res.send('Resource requested is not found')
    }
});

app.use(errHandler)

mongoose.connection.once('open',()=>{
    console.log('Connection Established')
    app.listen(PORT ,()=>{
        console.log(`Server running on PORT ${PORT}`)
    })
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
})