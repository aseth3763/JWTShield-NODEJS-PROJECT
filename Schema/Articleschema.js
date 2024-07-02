const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    heading : {
        type : String,
        required  : true
    },
    description : 
    {
        type : String,
        required : true
    },
    images : {
        type : String
    }
},{timestamps:true})

const ArticleModel = mongoose.model("ArticleData" , ArticleSchema)

module.exports = ArticleModel;