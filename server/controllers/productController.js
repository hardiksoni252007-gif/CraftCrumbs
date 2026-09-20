import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, dietary, sort, featured } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (dietary && dietary !== 'All') {
      query.dietaryTags = dietary;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };

    const products = await Product.find(query).sort(sortOptions);

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// @desc    Fetch single product by ID or slug
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Artisanal product not found' });
    }
  } catch (error) {
    console.error('Fetch single product error:', error);
    res.status(500).json({ message: 'Error retrieving product details' });
  }
};

// @desc    Get product categories summary
// @route   GET /api/products/meta/categories
export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const dietaryTags = await Product.distinct('dietaryTags');
    res.json({ categories, dietaryTags });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
