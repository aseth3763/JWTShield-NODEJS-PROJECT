const express = require("express")
const router = express.Router()
const controller = require("../Controller/NodeController")
const upload = require("../upload")
const  {jwtAuthMiddleware} = require("./../jwt_Token")


router.post("/createData", upload.array("images",4) , controller.createData);
router.get("/getAllData" , jwtAuthMiddleware , controller.getAllData)
router.get("/singleData/:id" , controller.singleData)

router.post("/jwtLogin",controller.jwtLogin)
router.get("/getProfile",jwtAuthMiddleware,controller.getProfile)

router.put("/update/:id" , controller.newData)
router.post("/addNewImage/:id", upload.single("image") , controller.addNewImage)


router.delete("/deleteAllImages/:id" , controller.deleteAllImages)
router.delete("/deleteImage/:id",controller.deleteImage)
router.delete("/delete/:id" , controller.deleteData);


router.post("/login",controller.userLogin)
router.put("/changePassword",controller.verifyUser)


router.post("/gen_otp",controller.generate_otp)
router.post("/verify_otp",controller.verifyOTP)
router.post("/reset_password/:id", controller.resetPassword)

router.post("/updateAndCreate", upload.single("images") , controller.updateAndCreate)
router.get("/getArray",controller.getArray)

module.exports = router;