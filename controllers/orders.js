import Order from "../models/order.js";
import axios from "axios";

// the frontend sends a post request to /orders
// which runs connectToCashfree which in turn creates an order in the backend
// and sends a request to cashfree to create a payment session
// and sends the payment session id to the frontend
// which then redirects the user to the payment page

export const connectToCashFree = async (req, res) => {
  const { order_id, order_amount, order_currency, customer_details, order_meta, order_items } = req.body;
  const newOrder = new Order({
    order_id,
    order_amount,
    order_currency,
    customer_details,
    payment_status: "PENDING",
    order_items,
  });

  // save to the db
  await newOrder.save();

  const options = {
    method: "POST",
    url: "https://sandbox.cashfree.com/pg/orders",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": "TEST34855630b1cee54140a2b3660c655843", // move to .env
      "x-client-secret": "TESTf508110b295fc14f2e04a1c79c9404efaaf29562", // same
    },
    data: JSON.stringify({
      order_id: order_id,
      order_amount: order_amount,
      order_currency: order_currency,
      customer_details: customer_details,
      order_meta: order_meta,
    }),
  };

  try {
    // response is the response from cashfree which contains the payment session id

    const response = await axios(options);
    // send to frontend
    res.json(response.data);

    console.log("backend", response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error in connectToCashfree in backend" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const {order_id} = req.params;
    const order = await Order.findOne({order_id});

    if (!order) {
      return res.status(404).json({ message: 'Order not found in db' });
    }

    res.json(order);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "error in getOrderDetails in backend" });
  }
};