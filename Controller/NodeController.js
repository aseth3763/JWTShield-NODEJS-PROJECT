const CRUDModel = require("../Schema/CRUDSchema");
const OtpModel = require("../Schema/otpSchema");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const ArticleModel = require("../Schema/Articleschema");

const  {generateToken} = require("./../jwt_Token");


//Post method
const createData = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // let image = req.files.filename;

    //For multiple images
    let images = req.files.map((file) => file.filename);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide name",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide password",
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Please provide role",
      });
    }

    const existingData = await CRUDModel.findOne({ email });

    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const data = new CRUDModel({
      name,
      email,
      password,
      role,
      images
    });

    console.log(data);
    await data.save();

    const payload = {
      id: data.id,
      email: data.email,
    };

    const token = generateToken(payload);

    console.log("Token is :", token);
    return res.status(200).json({
      data: data,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


//get profile(jwt token)
const getProfile = async (req,res) => {
  try {
    const userData =  req.user
    console.log(userData);
    if(!userData){
      return res.status(400).json({
        success : false,
        message  : "user not found"
      })
    }

    const data = userData.id

    const user = await CRUDModel.findById(data)
    console.log(user);

    return res.status(200).json({
      success: true,
      message : "Data fetched successfully",
      data : user 
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
}

//JWT login routes
const jwtLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide password",
      });
    };

    const user = await CRUDModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide correct email",
      });
    }
    if (!user || !(await bcrypt.compare(password,user.password))) {
      return res.status(400).json({
        success: false,
        message: "Please provide correct password",
      });
    }

    const payload = {
      id: user.id,
      email: user.email
    };

    const token = generateToken(payload);
    return res.json({token})

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


//Get method(all data)
const getAllData = async (req, res) => {
  try {
    const allData = await CRUDModel.find().sort({ createdAt: -1 });
    if (allData.length === 0 || !allData) {
      return res.status(400).json({
        success: false,
        message: "Data not present",
      });
    }

    const formattedData = allData.map((value) => ({
      data_Id: value._id,
      name: value.name,
      email: value.email,
      password: value.password,
      image: value.images,
    }));

    return res.status(200).json({
      success: true,
      message: "Data Fetched",
      response: formattedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


//get method(single data)
const singleData = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "please enter id or correct id",
      });
    }

    const data = await CRUDModel.findById(id);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "id is wrong",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Fetched",
      response: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


//delete all image in array
const deleteAllImages = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "please enter id or correct id",
      });
    }
    const data = await CRUDModel.findByIdAndUpdate(
      id,
      { images: [] },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "id not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All images deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


//delete single image in an array
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "please enter id or correct id",
      });
    }

    const { imageIndex } = req.body;
    console.log(imageIndex);

    const data = await CRUDModel.findById(id);

    console.log(data);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "id not found",
      });
    }

    if (imageIndex < 0 || imageIndex >= data.images.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid image index",
      });
    }

    // Get the image name from the images array
    const imageName = data.images[imageIndex];
    console.log(imageName);

    // Remove the image from the images array
    data.images.splice(imageIndex, 2);

    // Delete the image file from the filesystem
    const imagePath = `Upload/${imageName}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await data.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//add new image in array
const addNewImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.file.filename;

    console.log(image);
    const data = await CRUDModel.findByIdAndUpdate(
      id,
      {
        $push: { images: image },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "New image added",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//update method
const newData = async (req, res) => {
  try {
    const id = req.params.id;
    const updateValue = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not fetched",
      });
    }

    const data = await CRUDModel.findByIdAndUpdate(id, updateValue, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "id is wrong",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Saved",
      response: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


//delete method
const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id not fetched",
      });
    }

    const data = await CRUDModel.findByIdAndDelete(id);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "id is wrong",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data Deleted",
      response: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
      error_message: error.message,
    });
  }
};


/// login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        emailMessage: "email Required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        passwordMessage: "password Required",
      });
    }

    // Find Admin by email
    const admin = await CRUDModel.findOne({ email });

    if (!admin) {
      return res
        .status(401)
        .json({ emailMessage: "username incorrect", success: false });
    }

    // Check if the stored password is in plain text
    if (admin.password && admin.password.startsWith("$2b$")) {
      // Password is already bcrypt hashed
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ passwordMessage: "Password incorrect", success: false });
      }
    } else {
      // Convert plain text password to bcrypt hash
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update the stored password in the database
      admin.password = hashedPassword;
      await admin.save();
    }

    return res.status(200).json({
      message: `${admin.role} login successfully`,
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


//update password
const verifyUser = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const requiredFields = ["email", "oldPassword", "newPassword"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `missing ${field.replace("_", " ")} field`,
          success: false,
        });
      }
    }

    // find user by Id
    const user = await CRUDModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ NotUser: " user not found", success: false });
    } else {
      // check if old password match with stored password

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        return res.status(400).json({
          IncorrectPassword: "Old Password incorrect ",
          success: false,
        });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "old password and new password cannot be same",
        });
      }

      user.password = newPassword;
      await user.save();
      return res.status(200).json({
        successMessage: " Password changed Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ serverMessage: "Internal server error ", success: false });
  }
};


//generate otp
const generate_otp = async (req, res) => {
  try {
    const { email } = req.body;

    // check for email required
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email required",
      });
    }

    // check for user
    const user = await CRUDModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    const length = Math.floor(Math.random() * 3) + 4; //Random length between 4 to 6 digits
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); // Append a random digit (0-9)
    }

    const otpData = {
      userId: user._id,
      otp: otp,
    };

    await OtpModel.create(otpData);

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aseth3763@gmail.com",
        pass: "fwdg wvhe qoya fyhk",
      },
    });

    const mailOptions = {
      from: "aseth3763@gmail.com",
      to: "aseth9900@gmail.com", // Send email to the user's email
      subject: "Your OTP for Verification",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      success: true,
      message: "You should receive an email with OTP",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


//Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        success: true,
        message: "otp required",
      });
    }

    const userOTP = await OtpModel.findOne({ otp });
    if (!userOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Delete Otp
    await OtpModel.deleteOne({ otp });

    return res.status(200).json({
      success: true,
      message: "otp matched",
      data: userOTP.userId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//reset password
const resetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, confirmPassword } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "password is required",
      });
    }
    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "confirmPassword is required",
      });
    }

    const user = await CRUDModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "InCorrect ID",
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      return res.status(400).json({
        success: false,
        message: "Password should not match with old password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// update and createDate in same API
const updateAndCreate = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const images = req.file.filename;
    const Detail = { heading, description, images };
    console.log(Detail);
    for (let key in Detail) {
      if (!Detail[key]) {
        console.log(Detail[key]);
        return res.status(400).json({
          success: false,
          message: `${Detail[key]} not found`,
        });
      }
    }

    //update
    const existingData = await ArticleModel.findOne({ heading });
    if (existingData) {
      existingData.description = "My name is anthony";
      await existingData.save();
      return res.status(200).json({
        success: true,
        message: "data updated",
        data: existingData,
      });
    }

    const insertData = new ArticleModel({
      heading,
      description,
      images,
    });

    await insertData.save();

    return res.status(200).json({
      success: true,
      message: "Data saved",
      data: insertData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


const getArray = async (req, res) => {
  try {
    const data = await ArticleModel.find();
    console.log(data);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "data not found",
      });
    }

    const showData = data.map((value) => ({
      heading: value.heading,
      description: value.description,
      images: value.images,
    }));

    console.log(showData);

    return res.status(400).json({
      success: true,
      message: "data fetched",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createData,
  getAllData,
  singleData,
  newData,
  deleteData,
  userLogin,
  verifyUser,
  generate_otp,
  verifyOTP,
  resetPassword,
  deleteAllImages,
  deleteImage,
  addNewImage,
  updateAndCreate,
  getArray,
  getProfile,
  jwtLogin
};
