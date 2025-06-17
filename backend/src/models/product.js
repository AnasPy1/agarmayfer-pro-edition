const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['structural', 'reinforcement', 'pipes', 'sheets']
    },
    featured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema, 'products_agarmayfer');
