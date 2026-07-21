const { createCategory, getAllCategories, updateCategory, deleteCategory} = require('./category.controller');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');

async function categoryRoutes(fastify) {
    // public routes
    fastify.get('/categories', getAllCategories);

    // protected routes
    fastify.post('/categories', { preHandler: [authMiddleware, requireRole(1,2)]}, createCategory);
    fastify.patch('/categories/:id', { preHandler: [authMiddleware, requireRole(1, 2)]}, updateCategory);
    fastify.delete('/categories/:id', {preHandler: [authMiddleware, requireRole(1,2)]}, deleteCategory);
}

module.exports = categoryRoutes;