import * as Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const id = await Review.createReview(userId, productId, rating, comment);
    res.status(201).json({ id, message: 'Review created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.getReviewsByProductId(req.params.productId);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const success = await Review.deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};