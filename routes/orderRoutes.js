const express = require('express');
const router = express.Router();
const {
    authorizePermissions,
    authenticateUser,
  } = require("../middleware/authentication");

const {getAllOrders,getSingleOrder,getCurrentUserOrders,createOrder,updateOrder} = require('../controller/orderController');

router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllOrders).post(authenticateUser,createOrder)
router.route('/showAllMyOrders').get(authenticateUser,getCurrentUserOrders);
router.route("/:id").get(authenticateUser,getSingleOrder).patch(authenticateUser,updateOrder);

module.exports = router;