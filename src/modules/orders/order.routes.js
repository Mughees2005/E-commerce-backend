const { placeOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus } = require('./order.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function orderRoutes(fastify) {
    // user routes 
    fastify.post('/orders', {
        preHandler: [authMiddleware],
        schema: {
            body: {
                type: 'object',
                required: ['customer_name', 'customer_phone', 'customer_email', 'customer_address', 'area_id'],
                properties: {
                    customer_name: { type: 'string', minLength: 1 },
                    customer_phone: { type: 'string', minLength: 10 },
                    customer_email: { type: 'string', format: 'email' },
                    customer_address: { type: 'string', minLength: 1 },
                    area_id: { type: 'integer' },
                    notes: { type: ['string', 'null'] }
                }
            }
        }
    }, placeOrder);

    fastify.get('/orders', {preHandler: [authMiddleware]}, getOrders);
    fastify.get('/orders/:id', { preHandler: [authMiddleware]}, getOrderById);

    // admin routes
    fastify.get('/admin/orders', { preHandler: [authMiddleware, requireRole(1,2)]}, getAllOrders);
    
    fastify.patch('/orders/:id/status', {
        preHandler: [authMiddleware, requireRole(1,2)],
        schema: {
            body: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: { type: 'string', enum: ['pending', 'delivered', 'cancelled'] }
                }
            }
        }
    }, updateOrderStatus);
}

module.exports = orderRoutes;