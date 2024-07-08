import Review from "../Models/reviews.js";
import asyncHandler from "express-async-handler"

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, product } = req.body;
  const review = new Review({
    user: req.user._id,
    product,
    rating,
    comment,
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

export default addReview;