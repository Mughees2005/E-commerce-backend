const { getWishlist, addWishlistItem, removeWishlistItem } = require('./wishlist.controller');
const authMiddleware = require('../../middleware/auth');

async function wishlistRoutes(fastify) {
    fastify.get('/wishlist', { preHandler: [authMiddleware] }, getWishlist);
    fastify.post('/wishlist/items', { preHandler: [authMiddleware] }, addWishlistItem);
    fastify.delete('/wishlist/items/:productId', { preHandler: [authMiddleware] }, removeWishlistItem);
}

module.exports = wishlistRoutes;
