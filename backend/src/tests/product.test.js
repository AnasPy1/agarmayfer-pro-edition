const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('Product API Tests', () => {
    let testProductId;

    // Test data
    const testProduct = {
        name: "Test H-Beam Steel",
        price: 850.00,
        image: "./images/products/test-beam.jpeg",
        description: "Test description",
        category: "structural",
        featured: true,
        stock: 100
    };

    // Before all tests, connect to test database
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agarmayfer_test');
    });

    // After all tests, close database connection
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test creating a product
    test('POST /api/products - Create new product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(testProduct);
        
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(testProduct.name);
        testProductId = response.body._id;
    });

    // Test getting all products
    test('GET /api/products - Get all products', async () => {
        const response = await request(app)
            .get('/api/products');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Test getting featured products
    test('GET /api/products/featured - Get featured products', async () => {
        const response = await request(app)
            .get('/api/products/featured');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.every(product => product.featured)).toBeTruthy();
    });

    // Test getting products by category
    test('GET /api/products/category/structural - Get products by category', async () => {
        const response = await request(app)
            .get('/api/products/category/structural');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.every(product => product.category === 'structural')).toBeTruthy();
    });

    // Test getting product by ID
    test('GET /api/products/:id - Get product by ID', async () => {
        const response = await request(app)
            .get(`/api/products/${testProductId}`);
        
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(testProductId);
        expect(response.body.name).toBe(testProduct.name);
    });

    // Test updating a product
    test('PUT /api/products/:id - Update product', async () => {
        const updateData = {
            price: 900.00,
            stock: 95
        };

        const response = await request(app)
            .put(`/api/products/${testProductId}`)
            .send(updateData);
        
        expect(response.status).toBe(200);
        expect(response.body.price).toBe(updateData.price);
        expect(response.body.stock).toBe(updateData.stock);
    });

    // Test deleting a product
    test('DELETE /api/products/:id - Delete product', async () => {
        const response = await request(app)
            .delete(`/api/products/${testProductId}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Product deleted successfully');
    });
}); 