const express = require("express");
const router = express.Router();
const {
  getSingleUser,
  getAllUsers,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/showUser").get(authenticateUser, showCurrentUser);
router.route("/updatePassword").patch(authenticateUser,updateUserPassword);
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
