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

module.exports = { sendOrderConfirmation };