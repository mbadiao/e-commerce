import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true,
        min: 3,
        max: 20
    },
    description: { 
        type: String, 
        required: true,
        min: 10,
        max: 200,
    },
    price: { 
        type: Number, 
        required: true,
        min: 1,
    },
    category: { 
        type: String, 
        required: true,
        min: 3,
        max: 20,
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0,
    },
    imageUrl: { 
        type: String, 
        required: true 
    },
    reviews: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review" 
        }
    ],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
