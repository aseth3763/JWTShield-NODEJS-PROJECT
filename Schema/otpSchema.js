const mongoose = require("mongoose")
require("./CRUDSchema")
const OtpSchema = new mongoose.Schema({
    userId  : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "details"  // this is referencing to the collection of CRUDModel
    },
    otp : {
        type : Number,
        required : true
    }
})

const OtpModel = mongoose.model("OTP" , OtpSchema )

module.exports = OtpModel