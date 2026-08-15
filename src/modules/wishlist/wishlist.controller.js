const { getWishlist, addWishlistItem, removeWishlistItem } = require('./wishlist.service');

async function getWishlistHandler(req, reply) {
    try {
        return reply.send({ items: await getWishlist(req.user.id) });
    } catch (error) {
        return reply.code(500).send({ error: error.message });
    }
}

async function addWishlistItemHandler(req, reply) {
    try {
        const item = await addWishlistItem(req.user.id, req.body.product_id);
        return reply.code(201).send(item);
    } catch (error) {
        return reply.code(400).send({ error: error.message });
    }
}

async function removeWishlistItemHandler(req, reply) {
    try {
        return reply.send(await removeWishlistItem(req.user.id, req.params.productId));
    } catch (error) {
        return reply.code(404).send({ error: error.message });
    }
}

module.exports = { getWishlist: getWishlistHandler, addWishlistItem: addWishlistItemHandler, removeWishlistItem: removeWishlistItemHandler };
