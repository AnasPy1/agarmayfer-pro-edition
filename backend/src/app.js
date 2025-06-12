const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images) from the frontend images directory
app.use('/images', express.static(path.join(__dirname, '../../images')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../')));


// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    
    // Serve the appropriate HTML file based on the route
    let htmlFile = 'index.html';
    
    if (req.path.includes('/pages/')) {
        // Extract the page name from the path
        const pageName = req.path.split('/pages/')[1];
        if (pageName && pageName.endsWith('.html')) {
            htmlFile = path.join('pages', pageName);
        }
    } else if (req.path !== '/' && !req.path.includes('.')) {
        // Handle routes like /products, /contact, etc.
        const pageName = req.path.substring(1);
        htmlFile = path.join('pages', pageName + '.html');
    }
    
    const filePath = path.join(__dirname, '../../', htmlFile);
    res.sendFile(filePath, (err) => {
        if (err) {
            // If file not found, serve index.html
            res.sendFile(path.join(__dirname, '../../index.html'));
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agarmayfer')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Images served at: http://localhost:${PORT}/images/`);
    });
}

module.exports = app;
