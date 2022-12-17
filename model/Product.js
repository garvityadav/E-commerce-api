const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please provide product name"],
      maxLength: [100, "Name can not be more than 100 char"],
    },
    price: {
      type: Number,
      required: [true, "please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "please provide product description"],
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "please provide product company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: `{VALUE} is not supported`,
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: [true, "please provide product color"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "please provide product inventory"],
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});
module.exports = mongoose.model("Products", ProductSchema);
