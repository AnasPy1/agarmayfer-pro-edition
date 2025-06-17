const mongoose = require('mongoose');
const Product = require('./models/product');

const BASE_URL = process.env.BASE_URL || 'http://160.176.252.217:5000';
const products = [
  {
    name: "H-Beam Steel 200x200mm",
    image: `${BASE_URL}/images/products/H-Beam Steel 200x200mm.jpeg`,
    description: "High-strength structural H-beam, Grade A36, length customizable",
    category: "structural",
    featured: true,
    stock: 100
  },
  {
    name: "Reinforcement Steel Bars 16mm",
    image: `${BASE_URL}/images/products/Reinforcement Steel Bars 16mm.jpeg`,
    description: "Grade 60 reinforcement bars, bundle of 10",
    category: "reinforcement",
    featured: true,
    stock: 200
  },
  {
    name: "Galvanized Steel Sheet 1.2mm",
    image: `${BASE_URL}/images/products/Galvanized Steel Sheet 1.2mm.jpeg`,
    description: "Corrosion-resistant galvanized sheet, 4x8 ft",
    category: "sheets",
    featured: false,
    stock: 150
  },
  {
    name: "Stainless Steel Pipe 4-inch",
    image: `${BASE_URL}/images/products/Stainless Steel Pipe 4-inch.jpeg`,
    description: "Schedule 40 stainless steel pipe, per meter",
    category: "pipes",
    featured: false,
    stock: 300
  },
  {
    name: "Mild Steel Angle 50x50mm",
    image: `${BASE_URL}/images/products/Mild Steel Angle 50x50mm.jpeg`,
    description: "Mild steel angle bar, length 6m",
    category: "angles",
    featured: true,
    stock: 80
  },
  {
    name: "PVC Conduit Pipe 25mm",
    image: `${BASE_URL}/images/products/PVC Conduit Pipe 25mm.jpeg`,
    description: "Electrical conduit pipe, 3m length",
    category: "pipes",
    features: false,
    stock: 400
  },
  {
    name: "Copper Wire 1.5mm",
    image: `${BASE_URL}/images/products/Copper Wire 1.5mm.jpeg`,
    description: "High conductivity copper wire, 100m roll",
    category: "wires",
    featured: false,
    stock: 500
  }
];

// Connect to MongoDB and seed products
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return Product.countDocuments();
  })
  .then(async (count) => {
    if (count === 0) {
      await Product.insertMany(products);
      console.log('Sample products added with updated image paths!');
    } else {
      console.log('Products already exist. Skipping insertion.');
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 