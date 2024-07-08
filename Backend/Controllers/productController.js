import Product from "../Models/productModel.js";
import asyncHandler from "express-async-handler";
import { config } from "dotenv";
config();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({message:"Product not found"});
  }
});

// import { Client, Storage, ID, InputFile } from "node-appwrite";


const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, imageUrl } = req.body;
  const image = `${process.env.IMAGE_ENDPOINT}${process.env.IMAGE_BUCKET_ID}/files/${imageUrl}/view?project=${process.env.IMAGE_PROJECT_ID}`
try{ 
    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      imageUrl :image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;
  const { file } = req;

  let updatedFields = {
    name,
    price,
    description,
    category,
    stock,
  };

  if (file) {
    const fileName = `${file.originalname}`;
    updatedFields.imageUrl = `/images/${fileName}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (product) {
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
