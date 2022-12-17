const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser} = require("../utils/index");

//controllers

//register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError("Please provide required details!");
  }

  const ifFirstAccount = (await User.countDocuments({})) === 0;
  const role = ifFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  const tokenUser =createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ name: user.name, email: user.email });
};

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide required details!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPassVerified = await user.comparePassword(password);

  if (!isPassVerified) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials!");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json(tokenUser);
};

//logout
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("User logged out!");
};

module.exports = { register, login, logout };
