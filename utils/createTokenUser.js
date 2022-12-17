const createTokenUser = (user)=>{
    return {
        name: user.name,
        userID: user._id.toHexString(),
        role: user.role,
      }

}

module.exports = createTokenUser
