const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

router
  .route("/")
  .get(getAllReviews)
  .post(authenticateUser, authorizePermissions("user", "admin"), createReview);
router
  .route("/:id")
  .patch(authenticateUser, authorizePermissions("user"), updateReview)
  .delete(authenticateUser, authorizePermissions("user"), deleteReview)
  .get(getSingleReview);

module.exports = router;
