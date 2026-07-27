const { Cart, CartItem, Product } = require('../../database/models/index');

async function addToCart(userId, productId, quantity) {
    // check if product exists
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');
    if (!product.is_active) throw new Error('Product is not available');

    // check stock
    if (product.quantity < quantity) throw new Error('Insufficient stock');

    // get or create cart for user
    let [cart] = await Cart.findOrCreate({
        where: { user_id: userId },
    });

    // check if product already in cart
    let cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: productId }
    });

    // Product already in cart - just increase the quantity
    // Example: quantity was 2, user adds 1 more → becomes 3
    if (cartItem) {
        // update quantity if already exists
        await cartItem.update({ quantity: cartItem.quantity + quantity });
    } else {
        // Product not in cart - create new cart item
        // Price is stored at time of adding (in case price changes later)
        cartItem = await CartItem.create({
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price: product.price
        });
    }

    return cartItem;
}

async function getCart(userId) {
    // Find user's cart with all items and product details
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [
            {
                model: CartItem,
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'price', 'quantity', 'is_active']
                    }
                ]
            }
        ]
    });

    // If no cart found, return empty cart
    if (!cart) return { items: [], total: 0 };

    // Calculate total price of all items in cart
    const total = cart.CartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    return { cart, total };
}

async function updateCartItem(cartItemId, quantity, userId) {
    // Find the cart item
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) throw new Error('Cart item not found');

    // Make sure this cart belongs to the requesting user
    const cart = await Cart.findOne({ where: { id: cartItem.cart_id, user_id: userId } });
    if (!cart) throw new Error('Unauthorized');

    // Check if enough stock available
    const product = await Product.findByPk(cartItem.product_id);
    if (product.quantity < quantity) throw new Error('Insufficient stock');

    // Update quantity
    await cartItem.update({ quantity });
    return cartItem;
}

async function removeFromCart(cartItemId, userId) {
    // Find the cart item
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) throw new Error('Cart item not found');

    // Make sure this cart belongs to the requesting user
    const cart = await Cart.findOne({ where: { id: cartItem.cart_id, user_id: userId } });
    if (!cart) throw new Error('Unauthorized');

    // Delete the cart item permanently
    await cartItem.destroy();
    return { message: 'Item removed from cart' };
}

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };