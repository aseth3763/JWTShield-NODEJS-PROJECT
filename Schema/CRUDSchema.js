const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const CRUDSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "user"],
      default: "user",
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

CRUDSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const CRUDModel = mongoose.model("Details", CRUDSchema);

module.exports = CRUDModel;
