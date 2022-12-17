require("dotenv").config();
const jwt = require("jsonwebtoken");

const isTokenValid = (token) =>{return jwt.verify(token, process.env.JWT_SECRET)};

const createJWT = (payload) => {
  return jwt.sign(
    { userID: payload.userID, name: payload.name,role:payload.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT(user);
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sign: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
