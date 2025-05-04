const mongoose = require("mongoose") ;
const mongoURL = "mongodb://localhost:27017/CRUD"

mongoose.connect(mongoURL)

const db =mongoose.connection 

db.on("connected",()=>{
    console.log("Connect successfully")
})

db.on("errror",(error)=>{
    console.log(error,"Error occurred")
})

db.on("disconnected",()=>{
    console.log("Disconnected")
})

module.exports = db