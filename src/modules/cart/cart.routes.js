const { addToCart, getCart, updateCartItem, removeFromCart } = require('./cart.controller');
const authMiddleware = require('../../middleware/auth');

async function cartRoutes(fastify) {
    // All cart routes are protected - user must be logged in
    fastify.post('/cart/items', { preHandler: [authMiddleware]}, addToCart);
    fastify.get('/cart', { preHandler: [authMiddleware]}, getCart);
    fastify.patch('/cart/items/:id', { preHandler: [authMiddleware]}, updateCartItem);
    fastify.delete('/cart/items/:id', { preHandler: [authMiddleware]}, removeFromCart);
}

module.exports = cartRoutes;