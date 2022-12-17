const Review = require("../model/Review");
const Product = require("../model/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils/index");

const createReview = async (req, res) => {
  const { productId } = req.body;
  req.body.user = req.user.userID;
  if (!productId) {
    throw new CustomError.BadRequestError("Please provide the product");
  }
  const isProductValid = await Product.findOne({ _id: productId });
  if (!isProductValid) {
    throw new CustomError.NotFoundError("Product not found!");
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userID,
  });
  if (alreadySubmitted) {
    throw new CustomError.UnauthorizedError(
      "You have already submitted review of this order!"
    );
  }
  req.body.product = isProductValid._id;

  const review = await Review.create(req.body);
  if (!review) {
    throw new StatusCodes.INTERNAL_SERVER_ERROR("Review not posted!");
  }

  res.status(StatusCodes.CREATED).send(review);
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  }).populate({
    path: "user",
    select: "name email",
  });
  res.status(StatusCodes.OK).json({ nbHits: reviews.length, reviews });
};
const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found for this id: ${reviewId}`
    );
  }

  res.status(StatusCodes.OK).json(review);
};
const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found for this id: ${reviewId}`
    );
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  review.save();
  res.status(StatusCodes.OK).json(review);
};
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found for this id: ${reviewId}`
    );
  }
  checkPermissions(req.user, review.user);
  review.remove();
  res.status(StatusCodes.OK).send(`review deleted successfully!`);
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
