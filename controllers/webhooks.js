import Order from "../models/order.js";

export const getPaymentStatus = async (req, res) => {
  console.log("webhook", req.body);
  const order_id = req.body.data.order.order_id;
  const payment_status = req.body.data.payment.payment_status;
  try {
    const order = await Order.findOne({ order_id });
    order.payment_status = payment_status;
    await order.save();
    res
      .status(200)
      .send("Webhook received successfully and updated to backend");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error in getPaymentStatus in backend" });
  }
};
