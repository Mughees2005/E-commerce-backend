const { placeOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus } = require('./order.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function orderRoutes(fastify) {
    // user routes 
    fastify.post('/orders', { preHandler: [authMiddleware]}, placeOrder);
    fastify.get('/orders', {preHandler: [authMiddleware]}, getOrders);
    fastify.get('/orders/:id', { preHandler: [authMiddleware]}, getOrderById);

    // admin routes
    fastify.get('/admin/orders', { preHandler: [authMiddleware, requireRole(1,2)]}, getAllOrders);
    fastify.patch('/orders/:id/status', {preHandler: [authMiddleware, requireRole(1,2)]}, updateOrderStatus);
}

module.exports = orderRoutes;