const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require('../products/product.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function productRoutes(fastify) {
    // Public routes
    fastify.get('/products', getAllProducts);
    fastify.get('/products/:id', getProductById);

    // protected routes (admin only)
    fastify.post('/products', {
        preHandler: [authMiddleware, requireRole(1, 2)],
        schema: {
            body: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                    name: { type: 'string', minLength: 1 },
                    price: { type: 'number', minimum: 0 },
                    description: { type: 'string' },
                    compare_at_price: { type: ['number', 'null'], minimum: 0 },
                    quantity: { type: ['integer', 'null'], minimum: 0 },
                    is_unlimited: { type: 'boolean' },
                    low_stock_threshold: { type: ['integer', 'null'], minimum: 0 },
                    category_id: { type: 'integer' },
                    is_featured: { type: 'boolean' }
                }
            }
        }
    }, createProduct);

    fastify.patch('/products/:id', {
        preHandler: [authMiddleware, requireRole(1, 2, 3)],
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string', minLength: 1 },
                    price: { type: 'number', minimum: 0 },
                    description: { type: 'string' },
                    compare_at_price: { type: 'number', minimum: 0 },
                    quantity: { type: 'integer', minimum: 0 },
                    is_unlimited: { type: 'boolean' },
                    low_stock_threshold: { type: 'integer', minimum: 0 },
                    category_id: { type: 'integer' },
                    is_featured: { type: 'boolean' },
                    is_active: { type: 'boolean' }
                }
            }
        }
    }, updateProduct);

    fastify.delete('/products/:id', { preHandler: [authMiddleware, requireRole(1)] }, deleteProduct);
}

module.exports = productRoutes;