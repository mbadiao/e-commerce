import mongoose from "mongoose";

const wishlist = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
});
const Wishlist = mongoose.models.cart || mongoose.models("Wishlist", wishlist);
export default Wishlist;
