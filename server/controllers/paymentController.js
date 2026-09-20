// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import Order from '../models/Order.js';

// // Initialize Razorpay instance if keys are provided
// const keyId = process.env.RAZORPAY_KEY_ID || '';
// const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

// let razorpayInstance = null;
// try {
//   razorpayInstance = new Razorpay({
//     key_id: keyId,
//     key_secret: keySecret,
//   });
// } catch (err) {
//   console.warn('Razorpay SDK init note:', err.message);
// }

// // @desc    Create a Razorpay order
// // @route   POST /api/payment/create-order
// export const createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, currency = 'INR', receiptNote } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Valid amount is required.' });
//     }

//     const amountInPaise = Math.round(amount * 100);
//     const receipt = receiptNote || `rcpt_${Date.now().toString().slice(-8)}`;

//     // Try real Razorpay order creation if instance exists and not a mock key
//     const isMockKey = keyId.includes('craftcrumbs') || !process.env.RAZORPAY_KEY_SECRET;

//     if (razorpayInstance && !isMockKey) {
//       try {
//         const options = {
//           amount: amountInPaise,
//           currency,
//           receipt,
//           notes: {
//             customer_id: req.user?._id?.toString() || 'guest',
//             app: 'Craft Crumbs E-Commerce',
//           },
//         };

//         const rzpOrder = await razorpayInstance.orders.create(options);
//         return res.json({
//           success: true,
//           isSandbox: false,
//           order: {
//             id: rzpOrder.id,
//             amount: rzpOrder.amount,
//             currency: rzpOrder.currency,
//             key: keyId,
//           },
//         });
//       } catch (rzpErr) {
//         console.warn('Live Razorpay API error, falling back to simulated sandbox mode:', rzpErr.message);
//       }
//     }

//     // Sandbox / Mock fallback order creation
//     const mockOrderId = `order_cc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
//     res.json({
//       success: true,
//       isSandbox: true,
//       order: {
//         id: mockOrderId,
//         amount: amountInPaise,
//         currency,
//         key: keyId,
//       },
//     });
//   } catch (error) {
//     console.error('Create payment order error:', error);
//     res.status(500).json({ message: error.message || 'Failed to initialize payment.' });
//   }
// };

// // @desc    Verify Razorpay payment and save order in DB
// // @route   POST /api/payment/verify-payment
// export const verifyPaymentAndCreateOrder = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       items,
//       shippingAddress,
//       subtotal,
//       tax,
//       discount = 0,
//       shipping = 0,
//       totalAmount,
//     } = req.body;

//     if (!razorpay_order_id || !items || !items.length || !shippingAddress) {
//       return res.status(400).json({ message: 'Incomplete payment or order data provided.' });
//     }

//     const isMockOrder = razorpay_order_id.startsWith('order_cc_');
//     let isSignatureValid = false;

//     if (isMockOrder) {
//       // In sandbox mode, auto-validate or check mock signature
//       isSignatureValid = true;
//     } else {
//       // Verify HMAC-SHA256 signature
//       const body = razorpay_order_id + '|' + razorpay_payment_id;
//       const expectedSignature = crypto
//         .createHmac('sha256', keySecret)
//         .update(body.toString())
//         .digest('hex');

//       isSignatureValid = expectedSignature === razorpay_signature;
//     }

//     if (!isSignatureValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment verification failed: Invalid transaction signature.',
//       });
//     }

//     // Create persistent order record in database
//     const newOrder = await Order.create({
//       user: req.user._id,
//       items: items.map(item => ({
//         product: item.productId || item._id,
//         name: item.name,
//         image: item.image,
//         price: item.price,
//         quantity: item.quantity,
//       })),
//       shippingAddress,
//       paymentMethod: 'Razorpay',
//       paymentInfo: {
//         razorpayOrderId: razorpay_order_id,
//         razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
//         razorpaySignature: razorpay_signature || 'verified_signature',
//         status: 'Paid',
//       },
//       subtotal,
//       tax,
//       discount,
//       shipping,
//       totalAmount,
//       orderStatus: 'Confirmed',
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Payment verified successfully and order placed!',
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error('Verify payment error:', error);
//     res.status(500).json({ message: error.message || 'Payment verification encountered an error.' });
//   }
// };
