const amqp = require('amqplib');

// Store connection and channel globally so we don't create new ones every time
let connection = null;
let channel = null;

// Establishes connection to RabbitMQ server
// Creates a channel (used to send/receive messages)
// Called once when server starts
async function connectRabbitMQ() {
    try {
        // Connect to RabbitMQ using credentials from .env
        connection = await amqp.connect({
            hostname: 'localhost',
            port: 5672,
            username: process.env.RABBITMQ_USER || 'admin',
            password: process.env.RABBITMQ_PASS || 'admin123'
        });

        // Channel is like a virtual connection inside the main connection
        // All messages are sent and received through the channel
        channel = await connection.createChannel();
        console.log('RabbitMQ connected');
        return channel;
    } catch (error) {
        console.log('RabbitMQ connection failed', error.message);
    }
}

// Returns existing channel or creates new connection if not connected
// Use this function wherever you need to send/receive messages
async function getChannel() {
    if (!channel) await connectRabbitMQ();
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };