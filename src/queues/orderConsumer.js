const { getChannel } = require('../config/rabbitmq');

const ORDER_QUEUE = 'order_confirmation';

// Consumer - listens to queue and processes messages
async function startOrderConsumer() {
    try {
        const channel = await getChannel();

        // Make sure queue exists
        await channel.assertQueue(ORDER_QUEUE, { durable: true });

        // Process one message at a time
        channel.prefetch(1);

        console.log('Order consumer started, waiting for messages...');

        // Listen for messages
        channel.consume(ORDER_QUEUE, async (message) => {
            if (message) {
                // Convert message back to object
                const orderData = JSON.parse(message.content.toString());

                console.log('Order received from queue:', orderData.order_number);
                console.log('Send email to:', orderData.user_email);
                console.log('Order details:', orderData);

                // Acknowledge message - tell RabbitMQ we processed it
                channel.ack(message);
            }
        });
    } catch (error) {
        console.log('Consumer error:', error.message);
    }
}

module.exports = { startOrderConsumer };