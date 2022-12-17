const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse,checkPermissions } = require("../utils");

//controllers

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .select("-__v");
  res.status(StatusCodes.OK).send({ nbHits: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password").select("-__v");
  if (!user) {
    throw new CustomError.NotFoundError(`No user of this ID: ${id}`);
  }
  checkPermissions(req.user,id);
  res.status(StatusCodes.OK).send(user);
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

const updateUserPassword = async (req, res) => {
  const { userID } = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide required details!");
  }

  const user = await User.findById(userID);
  const isPassVerified = await user.comparePassword(oldPassword);
  if (!isPassVerified) {
    throw new CustomError.UnauthorizedError("Invalid Credentials!");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).send("Password updated Successfully!");
};

const updateUser = async (req, res) => {
  const { userID } = req.user;
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide required details!");
  }
  const user = await User.findById(userID);
  user.email = email;
  user.name = name;
  user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json(tokenUser);
};

module.exports = {
  getSingleUser,
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
