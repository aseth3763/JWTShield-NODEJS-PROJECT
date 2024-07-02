const express =  require("express")
const router = express.Router()
const mailController = require("../Controller/mailController")

router.post("/user/signup",mailController.signup)
router.get("/user/sendMail",mailController.send__Mail)

module.exports = router;