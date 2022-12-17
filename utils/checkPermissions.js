const CustomError = require('../errors')

const checkPermissions = (requestUser,resourceID)=>{

    if(requestUser.role==="admin") return;
    if(requestUser.userID===resourceID.toString()) return;
    throw new CustomError.UnauthorizedError('Not authorized to access this route');
};

module.exports = checkPermissions