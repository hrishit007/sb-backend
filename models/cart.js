import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  userId: { type: String, required: true },
  products: { type: String, required: true },
  price: { type: Number, required: true },
});

const Cart = mongoose.model('Cart',cartSchema);

export default Cart;