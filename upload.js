const multer = require("multer")

const storage  = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"Upload")
    },
    filename : function(req,file,cb){
        cb(null,file.originalname + "_" + Date.now()+".jpg")
    }
})

const upload = multer({storage:storage})

module.exports = upload;
