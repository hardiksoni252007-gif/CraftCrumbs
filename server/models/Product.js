import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Crochet Flowers & Bouquets',
      'Handmade Keychains',
      'Hairbands & Accessories',
      'Crochet Scrunchies',
      'Custom Gift Sets',
    ],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.9,
    min: 1,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 32,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockCount: {
    type: Number,
    default: 25,
  },
  dietaryTags: [{
    type: String,
  }],
  ingredients: [{
    type: String,
  }],
  weight: {
    type: String,
    default: 'Handmade with love',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
