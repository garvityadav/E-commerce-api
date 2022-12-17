require('dotenv').config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxLength: [50, "Name can't exceed more than 50 char"],
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide correct email",
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: [8, "Password can't be below 8 char"],
    required: [true, "Please provide Email"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isMatch;
};



module.exports = mongoose.model("Users", UserSchema);
