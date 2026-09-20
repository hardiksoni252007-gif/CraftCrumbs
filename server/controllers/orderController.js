import Order from '../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug price image');
    res.json(orders);
  } catch (error) {
    console.error('Fetch my orders error:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.product',
      'name slug price image'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure order belongs to requester or admin
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Error retrieving order' });
  }
};
