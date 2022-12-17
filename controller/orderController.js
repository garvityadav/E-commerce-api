const Order = require("../model/Order");
const Product = require("../model/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils/index");

// created fake stripe api
const fakeStripeAPI = async (amount, currency) => {
  const client_secret = "SomeRandomClientSecret";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getCurrentUserOrders = async (req, res) => {
  const userOrders = await Order.find({ user: req.user.userID });
  if (!userOrders) {
    throw new CustomError.NotFoundError(
      `No order of the user ${req.user.userID} found.`
    );
  }
  res.status(StatusCodes.OK).json({ count: userOrders.length, userOrders });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No Item in the cart");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and Shipping Fee!"
    );
  }

  let totalPrice = 0;
  let orderItems = [];
  for (const item of cartItems) {
    const product = await Product.findOne({ _id: item.product });
    if (!product) {
      throw new CustomError.NotFoundError(
        `There is no product of Id: ${item.product}`
      );
    }
    const { name, price, image, _id } = product;
    const singleCartItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    //add item to order
    orderItems = [...orderItems, singleCartItem];
    totalPrice += item.amount * price;
  }
  //calculate total
  const total = tax + shippingFee + totalPrice;
  //get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    tax,
    shippingFee,
    subtotal: totalPrice,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userID,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.userID;
  const { paymentIntentId } = req.body;

  if (!requestId || !userId) {
    throw new CustomError.BadRequestError(`Please provide order id`);
  }
  const order = await Order.findOne({ _id: requestId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order ${requestId} found.`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  order.save();

  res.status(StatusCodes.OK).json(order);
};

const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new CustomError.NotFoundError(`No order ${requestId} found.`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).send(order);
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
