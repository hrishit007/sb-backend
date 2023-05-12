import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    order_id: { type: String, required: true },
    order_amount: { type: Number, required: true },
    order_currency: { type: String, required: true },
    customer_details: {
        customer_id: { type: String, required: true },
        customer_name: { type: String, required: true },
        customer_email: { type: String, required: true },
        customer_phone: { type: String, required: true },
    },
    payment_status: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;