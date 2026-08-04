const { getAllDeliveryAreas, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea } = require('./delivery-areas.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function deliveryAreaRoutes(fastify) {
    // Public route - no auth needed
    fastify.get('/delivery-areas', getAllDeliveryAreas);

    // protected routes (admin)
    fastify.post('/delivery-areas', { preHandler: [authMiddleware, requireRole(1)]}, addDeliveryArea);
    fastify.patch('/delivery-areas/:id', { preHandler: [authMiddleware, requireRole(1)]}, updateDeliveryArea);
    fastify.delete('/delivery-areas/:id', { preHandler: [authMiddleware, requireRole(1)]}, deleteDeliveryArea);
}

module.exports = deliveryAreaRoutes;