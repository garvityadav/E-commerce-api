const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    title: {
      type: String,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      require: true,
    },
  },
  { timestamp: true }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productID) {
  const result = await this.aggregate([
    {$match:{product:productID}},
    {$group:{
      _id:null,averageRating:{$avg:"$rating"},numOfReviews:{$sum:1}
    }}
  ])
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
