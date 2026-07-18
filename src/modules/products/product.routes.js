const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require('../products/product.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function productRoutes(fastify) {
    // Public routes
    fastify.get('/products', getAllProducts);
    fastify.get('/products/:id', getProductById);

    // protected routes (admin only)
    // flow => Request → authMiddleware (logged in?) → roleMiddleware (right role?) → controller
    fastify.post('/products', { preHandler: [authMiddleware, requireRole(1, 2)] }, createProduct); // 1=super_admin, 2=product_manager
    fastify.patch('/products/:id', { preHandler: [authMiddleware, requireRole(1, 2, 3)] }, updateProduct);
    fastify.delete('/products/:id', { preHandler: [authMiddleware, requireRole(1) ], }, deleteProduct);
}

module.exports = productRoutes;