const { Order, OrderItem, Cart, CartItem, Product, User } = require('../../database/models/index');
const { sendOrderConfirmation, sendLowStockAlert, sendOutOfStockAlert } = require('../../queues/orderQueue');

// Place a new order from user's cart
// - Checks stock availability
// - Creates order and order items
// - Decreases product stock
// - Clears cart after order placed
async function placeOrder(userId, orderData) {
    const { payment_method, shipping_address_id, notes } = orderData;

    // Get user's cart with items
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{ model: CartItem, include: [Product] }]
    });

    // get user details for email
    const user = await User.findByPk(userId);

    if (!cart || cart.CartItems.length === 0) throw new Error('Cart is empty');

    // Calculate total
    let subtotal = 0;
    for (const item of cart.CartItems) {
        if (!item.Product.is_active) throw new Error(`${item.Product.name} is not available`);
        if (!item.Product.is_unlimited && item.Product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.Product.name}`);
        }
        subtotal += item.price * item.quantity;
    }

    // Generate unique order number
    const order_number = `ORD-${Date.now()}`;

    // Create order
    const order = await Order.create({
        order_number,
        user_id: userId,
        payment_method,
        shipping_address_id,
        notes: notes || null,
        subtotal,
        total: subtotal,
        status: 'pending',
        payment_status: 'pending',
        placed_at: new Date()
    });

    // Create order items and update stock
    for (const item of cart.CartItems) {
        await OrderItem.create({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.Product.name,
            product_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        });

        // Decrease product stock
        if (!item.Product.is_unlimited) {
            const newQuantity = item.Product.quantity - item.quantity;
            await item.Product.update({ quantity: newQuantity });

            // Out of stock alert
            if (newQuantity === 0) {
                await sendOutOfStockAlert({
                    product_name: item.Product.name,
                    product_id: item.Product.id
                });
        }
        // Low stock alert
        else if (item.Product.low_stock_threshold && newQuantity <= item.Product.low_stock_threshold) {
            await sendLowStockAlert({
                product_name: item.Product.name,
                product_id: item.Product.id,
                remaining_quantity: newQuantity,
                threshold: item.Product.low_stock_threshold
            });
        }
        }
    }

    // Clear cart after order placed
    await CartItem.destroy({ where: { cart_id: cart.id } });

    // Send order confirmation to queue
    await sendOrderConfirmation({
        order_number: order.order_number,
        user_email: user.email,
        user_name: user.full_name,
        items: cart.CartItems.map(item => ({
            name: item.Product.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: subtotal,
        payment_method: order.payment_method
    });

    return order;
}


// Get all orders of logged in user (My Orders page)
// - Returns orders newest first
async function getOrders(userId){
    const orders = await Order.findAll({
        where: { user_id: userId},
        include: [{ model: OrderItem}],
        order: [['createdAt', 'DESC']]
    });
    return orders;
}


// Get single order by ID for logged in user
// - user_id check ensures user can only see their own order
async function getOrderById(orderId, userId) {
    const order = await Order.findOne({
        where: { id: orderId, user_id: userId },
        include: [{ model: OrderItem }]
    });
    if (!order) throw new Error('Order not found');
    return order;
}


// Get all orders - Admin only
// - No user_id filter, returns all users orders
async function getAllOrders() {
    const orders = await Order.findAll({
        include: [{ model: OrderItem}],
        order: [[ 'createdAt', 'DESC']]
    });
    return orders;
}


// Update order status - Admin only
// - Status values: pending, confirmed, processing, shipped, delivered, cancelled
async function updateOrderStatus(orderId, status) {
    const order = await Order.findByPk(orderId);
    if(!order) throw new Error('Order not found');

    await order.update({status});
    return order;
}

module.exports = { placeOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus };

// placeOrder = order banao
// getOrders(userId) = user ke sare orders
// getOrderById(orderId, userId) = user ka ek specific order
// getAllOrders() = admin sab orders dekhe
// updateOrderStatus = admin status change kare