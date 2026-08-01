const { getChannel } = require('../config/rabbitmq');

// Queue name - consumer will also use the same name
const ORDER_QUEUE = 'order_confirmation';

// Yeh function order place hone ke baad call hoga
// orderData = jo bhi details consumer ko chahiye
async function sendOrderConfirmation(orderData) {
    try {
        // RabbitMQ se channel lo
        const channel = await getChannel();
        
        // Queue banao agar exist nahi karti
        await channel.assertQueue(ORDER_QUEUE, { durable: true });
        
        // orderData ko string banao aur queue mein daalo
        channel.sendToQueue(
            ORDER_QUEUE,
            Buffer.from(JSON.stringify(orderData)),
            { persistent: true }
        );

        console.log('Message sent to queue:', orderData.order_number);
    } catch (error) {
        console.log('Failed to send message:', error.message);
    }
}

// Send low stock alert to queue
async function sendLowStockAlert(productData) {
    const channel = await getChannel();
    await channel.assertQueue('low_stock_alert', { durable: true });
    channel.sendToQueue(
        'low_stock_alert',
        Buffer.from(JSON.stringify(productData)),
        { persistent: true }
    );
    console.log('Low stock alert sent:', productData.product_name);
}

// Send out of stock alert to queue
async function sendOutOfStockAlert(productData) {
    const channel = await getChannel();
    await channel.assertQueue('out_of_stock_alert', { durable: true });
    channel.sendToQueue(
        'out_of_stock_alert',
        Buffer.from(JSON.stringify(productData)),
        { persistent: true }
    );
    console.log('Out of stock alert sent:', productData.product_name);
}

module.exports = { sendOrderConfirmation, sendLowStockAlert, sendOutOfStockAlert };