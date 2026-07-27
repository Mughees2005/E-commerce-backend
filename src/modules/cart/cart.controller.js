const { addToCart, getCart, updateCartItem, removeFromCart } = require('../cart/cart.service');

async function addToCartHandler(req, reply) {
    try{
        const { product_id, quantity } = req.body;
        const cartItem = await addToCart(req.user.id, product_id, quantity);
        return reply.status(201).send(cartItem);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

async function getCartHandler(req, reply) {
        try{
            const cart = await getCart(req.user.id);
            return reply.send(cart);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

async function updateCartItemHandler(req, reply) {
        try{
            const { quantity } = req.body;
            const cartItem = await updateCartItem(req.params.id, quantity, req.user.id);
            return reply.send(cartItem);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

async function removeFromCartHandler(req, reply){
        try{
            const result = await removeFromCart(req.params.id, req.user.id);
            return reply.send(result);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

module.exports = {
    addToCart: addToCartHandler,
    getCart: getCartHandler,
    updateCartItem: updateCartItemHandler,
    removeFromCart: removeFromCartHandler
};