const { getChannel } = require('../config/rabbitmq');
const transporter = require('../config/email');

const ORDER_QUEUE = 'order_confirmation';
const LOW_STOCK_QUEUE = 'low_stock_alert';
const OUT_OF_STOCK_QUEUE = 'out_of_stock_alert';

const orderConfirmationTemplate = require('./templates/orderConfirmation');
const newOrderAdminTemplate = require('./templates/newOrderAdmin');
const lowStockAlertTemplate = require('./templates/lowStockAlert');
const outOfStockTemplate = require('./templates/outOfStock');

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
                const orderData = JSON.parse(message.content.toString());
        
                // Send email
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: orderData.user_email,
                    subject: `Order Confirmed - ${orderData.order_number}`,
                    html: orderConfirmationTemplate(orderData)
                });

                console.log('Order confirmation email sent to:', orderData.user_email);

                // Admin recieve new order notification
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER,
                    subject: `New Order Received - ${orderData.order_number}`,
                    html: newOrderAdminTemplate(orderData)
                });
                console.log('New order notification sent to admin');

                channel.ack(message);
            }
        });

        // Low stock consumer
        await channel.assertQueue(LOW_STOCK_QUEUE, { durable: true });
        channel.consume(LOW_STOCK_QUEUE, async (message) => {
            if (message) {
                const data = JSON.parse(message.content.toString());
            
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER, // admin email
                    subject: `Low Stock Alert - ${data.product_name}`,
                    html: lowStockAlertTemplate(data)
                });

                console.log('Low stock email sent for:', data.product_name);
                channel.ack(message);
            }
        });

        // Out of stock consumer
        await channel.assertQueue(OUT_OF_STOCK_QUEUE, { durable: true });
        channel.consume(OUT_OF_STOCK_QUEUE, async (message) => {
            if (message) {
                const data = JSON.parse(message.content.toString());
        
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER, // admin email
                    subject: `Out of Stock - ${data.product_name}`,
                    html: outOfStockTemplate(data)
                });

                console.log('Out of stock email sent for:', data.product_name);
                channel.ack(message);
            }
        });

    } catch (error) {
        console.log('Consumer error:', error.message);
    }
}

module.exports = { startOrderConsumer };