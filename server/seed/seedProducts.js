import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const products = [
  {
    name: 'Eternal Sunflower Crochet Bouquet',
    slug: 'eternal-sunflower-crochet-bouquet',
    category: 'Crochet Flowers & Bouquets',
    description: 'Delicately hand-knitted vibrant golden sunflower bouquet crafted with premium milk cotton yarn. Forever blooming, everlasting, and wrapped in elegant gift wrapping paper.',
    price: 299,
    image: '/sunflower_01.jpeg',
    rating: 5.0,
    reviewCount: 48,
    inStock: true,
    stockCount: 15,
    dietaryTags: ['Handmade', '100% Cotton Yarn', 'Everlasting'],
    ingredients: ['Premium Milk Cotton Yarn', 'Flexible Floral Wire Stems', 'Ribbon Wrap', 'Eco-kraft paper'],
    weight: '25cm height',
    featured: true,
  },
  {
    name: 'Pastel Tulip Garden Bouquet',
    slug: 'pastel-tulip-garden-bouquet',
    category: 'Crochet Flowers & Bouquets',
    description: 'Handcrafted crochet tulip stems in gentle pink, peach, and cream hues. Soft, hypoallergenic, and never withers. The perfect aesthetic desktop flower or anniversary gift.',
    price: 349,
    image: '/tulips.jpeg',
    rating: 4.9,
    reviewCount: 39,
    inStock: true,
    stockCount: 18,
    dietaryTags: ['Handmade', 'Soft Texture', 'Gift Ready'],
    ingredients: ['Soft Milk Yarn', 'Embroidered Petals', 'Floral Stem Wire', 'Satin Ribbon'],
    weight: '30cm bouquet',
    featured: true,
  },
  {
    name: 'Blooming Sunflower Tabletop Duo',
    slug: 'blooming-sunflower-tabletop-duo',
    category: 'Crochet Flowers & Bouquets',
    description: 'Double blossomed crochet sunflowers with textured brown seed centers and bright emerald foliage. Hand-stitched with care to brighten any room.',
    price: 279,
    image: '/sunflower_02.jpeg',
    rating: 4.8,
    reviewCount: 27,
    inStock: true,
    stockCount: 20,
    dietaryTags: ['Handmade', 'Colorfast', 'Washable'],
    ingredients: ['Double-twist Cotton Thread', 'Sturdy Floral Wire', 'Hand-stitched Leaves'],
    weight: '22cm height',
    featured: false,
  },
  {
    name: 'Coquette Ribbon Bow Keychain',
    slug: 'coquette-ribbon-bow-keychain',
    category: 'Handmade Keychains',
    description: 'Sweet, plush crochet bow charm with intricate stitch work and durable stainless lobster clasp. Chic accessory for bags, car keys, and backpacks.',
    price: 150,
    image: '/keychain_01.jpeg',
    rating: 4.9,
    reviewCount: 56,
    inStock: true,
    stockCount: 35,
    dietaryTags: ['Handmade', 'Compact', 'Durable Hardware'],
    ingredients: ['Soft Acrylic Cotton Yarn', 'Antique Gold Clasp', 'Reinforced Ring'],
    weight: '6cm x 5cm',
    featured: true,
  },
  {
    name: 'Mini Sunflower Charm Keychain',
    slug: 'mini-sunflower-charm-keychain',
    category: 'Handmade Keychains',
    description: 'Pocket-sized sunshine! Hand-crocheted miniature sunflower charm with hanging leaf detail and sturdy metal ring.',
    price: 150,
    image: '/keychain_02.jpeg',
    rating: 5.0,
    reviewCount: 62,
    inStock: true,
    stockCount: 40,
    dietaryTags: ['Handmade', 'Lightweight', 'Bestseller'],
    ingredients: ['Yellow & Umber Yarn', 'Stainless Steel Keyring', 'Hand-knotted loop'],
    weight: '7cm length',
    featured: true,
  },
  {
    name: 'Peacock Feather Motif Keychain',
    slug: 'peacock-feather-motif-keychain',
    category: 'Handmade Keychains',
    description: 'Inspired by graceful peacock plumage featuring jewel tones of royal sapphire, emerald, turquoise, and gold shimmer stitches.',
    price: 180,
    image: '/keychain_03.jpeg',
    rating: 4.9,
    reviewCount: 34,
    inStock: true,
    stockCount: 22,
    dietaryTags: ['Handmade', 'Artisan Crafted', 'Vibrant Colors'],
    ingredients: ['Multi-ply Mercerized Yarn', 'Heavy Duty Keyring', 'Lobster Swivel Clasp'],
    weight: '9cm length',
    featured: false,
  },
  {
    name: 'Sweet Couple Duck Amigurumi Keychains',
    slug: 'sweet-couple-duck-amigurumi-keychains',
    category: 'Handmade Keychains',
    description: 'Adorably cuddly matching couple ducklings wearing tiny berets/bows. Sold as a pair or perfect gift for best friends and partners.',
    price: 240,
    image: '/keychain_04.jpeg',
    rating: 5.0,
    reviewCount: 71,
    inStock: true,
    stockCount: 25,
    dietaryTags: ['Handmade', 'Amigurumi', 'Couple Gift'],
    ingredients: ['Hypoallergenic Polyfill Stuffing', 'Safety Bead Eyes', 'Milk Yarn', 'Twin Rings'],
    weight: '5cm each',
    featured: true,
  },
  {
    name: 'Cozy Couple Tortoise Charm Keychains',
    slug: 'cozy-couple-tortoise-charm-keychains',
    category: 'Handmade Keychains',
    description: 'Handmade slow-and-steady companion tortoises with detailed textured shells and cute smiling expressions.',
    price: 240,
    image: '/keychain_05.jpeg',
    rating: 4.8,
    reviewCount: 29,
    inStock: true,
    stockCount: 16,
    dietaryTags: ['Handmade', 'Amigurumi', 'Cute Aesthetic'],
    ingredients: ['Sage Green Cotton', 'Shell Stitching', 'Soft Fiberfill', 'Dual Keyrings'],
    weight: '6cm each',
    featured: false,
  },
  {
    name: 'Twin Sweet Cherry Pair Keychain',
    slug: 'twin-sweet-cherry-pair-keychain',
    category: 'Handmade Keychains',
    description: 'Glossy ruby red amigurumi cherries connected by a knitted green stem and leaf. Plump, bouncy, and irresistible.',
    price: 150,
    image: '/keychain_06.jpeg',
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    stockCount: 30,
    dietaryTags: ['Handmade', 'Lightweight', 'Fruity Pop'],
    ingredients: ['Ruby Red Cotton Yarn', 'Polyester Fiberfill', 'Resilient Stem Stitch'],
    weight: '8cm length',
    featured: false,
  },
  {
    name: 'Custom Monogram Initial Keychains',
    slug: 'custom-monogram-initial-keychains',
    category: 'Custom Gift Sets',
    description: 'Personalized crochet alphabet letters customized in your favorite pastel or vibrant color palette. Choose any letter from A to Z!',
    price: 199,
    image: '/keychain_07.png',
    rating: 5.0,
    reviewCount: 88,
    inStock: true,
    stockCount: 50,
    dietaryTags: ['Customizable', 'Handmade', 'Name Initial'],
    ingredients: ['Choice of Color Yarn', 'Reinforced Alphabet Core', 'Engraved Tag Support'],
    weight: '7cm letter',
    featured: true,
  },
  {
    name: 'Floral Daisy Crochet Hairband',
    slug: 'floral-daisy-crochet-hairband',
    category: 'Hairbands & Accessories',
    description: 'Comfortable stretch headband adorned with intricately crocheted daisies and botanical leaf motifs. Doesn’t pinch behind the ears.',
    price: 180,
    image: '/hairband_01.jpeg',
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    stockCount: 24,
    dietaryTags: ['Handmade', 'Zero Pinch', 'Soft Cotton'],
    ingredients: ['Flexible Non-slip Inner Band', 'Cotton Crochet Overlay', 'Daisies Stitched'],
    weight: 'Comfort Stretch',
    featured: true,
  },
  {
    name: 'Artisan Blossom Hair Clips & Accessories Set',
    slug: 'artisan-blossom-hair-clips-set',
    category: 'Hairbands & Accessories',
    description: 'Set of 3 handcrafted crochet flower hair clips with premium alligator clips covered in soft matching yarn ribbons to protect delicate hair.',
    price: 199,
    image: '/Hair_accessories.jpeg',
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    stockCount: 22,
    dietaryTags: ['Handmade', 'No Hair Tangle', 'Set of 3'],
    ingredients: ['Yarn Wrapped Alligator Clips', 'Micro Blossom Appliques', 'Glueless Sewing'],
    weight: '3-Piece Set',
    featured: false,
  },
  {
    name: 'Cloud Ruffle Crochet Scrunchy (Pastel Pink)',
    slug: 'cloud-ruffle-crochet-scrunchy-pink',
    category: 'Crochet Scrunchies',
    description: 'Voluminous, ultra-gentle ruffled crochet scrunchy knitted around a high-elastic core. Zero breakage and maximum cute factor for buns and ponytails.',
    price: 150,
    image: '/scrunchy_01.jpeg',
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    stockCount: 35,
    dietaryTags: ['Handmade', 'Anti-Breakage', 'High Elasticity'],
    ingredients: ['Premium Milk Cotton Yarn', 'Snag-free Elastic Band', 'Hand-finished edge'],
    weight: 'Standard Fluff',
    featured: true,
  },
  {
    name: 'Velvet Swirl Crochet Scrunchy (Lavender Mist)',
    slug: 'velvet-swirl-crochet-scrunchy-lavender',
    category: 'Crochet Scrunchies',
    description: 'Deep lavender crochet scrunchy with scalloped edges that double wrap comfortably on both fine and thick hair without tugging.',
    price: 150,
    image: '/scrunchy_02.jpeg',
    rating: 4.9,
    reviewCount: 51,
    inStock: true,
    stockCount: 30,
    dietaryTags: ['Handmade', 'Soft Grip', 'Everyday Luxury'],
    ingredients: ['Soft-spun Lavender Yarn', 'Reinforced Elastic Ring', 'Durable Edge Lock'],
    weight: 'Standard Fluff',
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🧶 Connected to MongoDB for Crochet Craft Crumbs seeding...');

    await Product.deleteMany({});
    console.log('🧹 Cleared existing products.');

    const createdProducts = await Product.insertMany(products);
    console.log(`✨ Successfully seeded ${createdProducts.length} handmade crochet products with GitHub images!`);

    // Create a demo customer account if it doesn't already exist
    const demoUserEmail = 'customer@craftcrumbs.com';
    let demoUser = await User.findOne({ email: demoUserEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Aria Montgomery',
        email: demoUserEmail,
        password: 'password123',
        phone: '+91 98765 43210',
        address: {
          street: '42 Baker Street, artisan quarter',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
        },
      });
      console.log('👤 Created demo customer: customer@craftcrumbs.com / password123');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
