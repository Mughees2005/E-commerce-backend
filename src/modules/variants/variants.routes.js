const { addVariant, getVariants, updateVariant, deleteVariant } = require('./variants.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function variantRoutes(fastify) {
    // Public routes
    fastify.get('/products/:productId/variants', getVariants);

    // Protected routes (admin only)
    fastify.post('/products/:productId/variants', { preHandler: [authMiddleware, requireRole(1, 2)] }, addVariant);
    fastify.patch('/variants/:id', { preHandler: [authMiddleware, requireRole(1, 2)] }, updateVariant);
    fastify.delete('/variants/:id', { preHandler: [authMiddleware, requireRole(1, 2)] }, deleteVariant);
}

module.exports = variantRoutes;