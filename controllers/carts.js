import Cart from "../models/cart.js";

// model

// const cartSchema = mongoose.Schema({
//     userId: { type: String, required: true },
//     products: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//   });
//note that the userId would just be params so, user and cartId are same.

//

export const PostCartData = async (req, res) => {
  const { userId, products, price } = req.body;
  const newCart = new Cart({
    cartId: `${userId}-${Math.random() * 1000}`,
    products: products,
    price: price,
  });
  try {
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// export const GetCartData = async (req, res) => {
//   const cartId = req.params;
//   try {
//     const cart = await Cart.findById(cartId);
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

