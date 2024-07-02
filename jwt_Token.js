//Jwt authentication

const jwt = require("jsonwebtoken")
require("dotenv").config();


//verification code for jwt
const jwtAuthMiddleware = (req,res,next)=>{
    try {

        const authorization = req.headers.authorization
        console.log(authorization)
        if(!authorization){
            return res.status(400).json("Token not Found")
        }

        const token = req.headers.authorization.split(" ")[1]
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(500).json(({
            success:false,
            error : "Invalid Token"
        }))
    }
}

//generate token
const generateToken = (userData) =>{
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000})
};


module.exports = {jwtAuthMiddleware,generateToken}