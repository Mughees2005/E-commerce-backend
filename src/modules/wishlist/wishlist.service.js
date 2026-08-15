const { WishlistItem, Product, ProductImage } = require('../../database/models/index');

async function getWishlist(userId) {
    return WishlistItem.findAll({
        where: { user_id: userId },
        include: [{
            model: Product,
            where: { is_active: true },
            required: true,
            include: [{ model: ProductImage, attributes: ['image_url', 'alt_text', 'is_primary'] }]
        }],
        order: [['createdAt', 'DESC']]
    });
}

async function addWishlistItem(userId, productId) {
    const product = await Product.findOne({ where: { id: productId, is_active: true } });
    if (!product) throw new Error('Product is not available');

    const [item] = await WishlistItem.findOrCreate({
        where: { user_id: userId, product_id: productId }
    });
    return item;
}

async function removeWishlistItem(userId, productId) {
    const deleted = await WishlistItem.destroy({ where: { user_id: userId, product_id: productId } });
    if (!deleted) throw new Error('Wishlist item not found');
    return { message: 'Item removed from wishlist' };
}

module.exports = { getWishlist, addWishlistItem, removeWishlistItem };
