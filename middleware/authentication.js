const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
  try {
    const { name, userID, role } = isTokenValid(token);
    req.user = { name, userID, role };
    next();
  } catch {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorize to access this route!"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
