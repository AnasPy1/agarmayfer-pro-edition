const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "H-Beam Steel 200x200mm",
    image: "http://localhost:5000/images/products/H-Beam Steel 200x200mm.jpeg",
    description: "High-strength structural H-beam, Grade A36, length customizable",
    category: "structural",
    featured: true,
    stock: 100
  },
  {
    name: "Reinforcement Steel Bars 16mm",
    image: "http://localhost:5000/images/products/Reinforcement Steel Bars 16mm.jpeg",
    description: "Grade 60 reinforcement bars, bundle of 10",
    category: "reinforcement",
    featured: true,
    stock: 200
  },
  {
    name: "Galvanized Steel Sheet 1.2mm",
    image: "http://localhost:5000/images/products/Galvanized Steel Sheet 1.2mm.jpeg",
    description: "Corrosion-resistant galvanized sheet, 4x8 ft",
    category: "sheets",
    featured: false,
    stock: 150
  },
  {
    name: "Stainless Steel Pipe 4-inch",
    image: "http://localhost:5000/images/products/Stainless Steel Pipe 4-inch.jpeg",
    description: "Schedule 40 stainless steel pipe, per meter",
    category: "pipes",
    featured: false,
    stock: 300
  }
];

mongoose.connect('mongodb://localhost:27017/agarmayfer')
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Sample products added with updated image paths!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 