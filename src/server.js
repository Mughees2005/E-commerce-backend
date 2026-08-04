require('dotenv').config({path: require('path').join(__dirname, '../.env')});
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const fastify = require('fastify')();
const sequelize = require('./config/database'); 
const { connectRabbitMQ } = require('./config/rabbitmq');
const { startOrderConsumer } = require('./queues/orderConsumer');
const redis = require('./config/redis')

async function setupDatabase() {
    try{
        await sequelize.authenticate();
        console.log('Database connected');

        await sequelize.sync({ alter: true });
        console.log('Tables Synced');

        await connectRabbitMQ(); // Connect to RabbitMQ message broker
        await startOrderConsumer; // Consumer start

        // registering auth routes
        fastify.register(require('./modules/auth/auth.routes'));

        // registering product routes
        fastify.register(require('./modules/products/product.routes'));

        // registring category routes
        fastify.register(require('./modules/categories/category.routes'));

        // registering cart routes
        fastify.register(require('./modules/cart/cart.routes'));

        // registering order routes
        fastify.register(require('./modules/orders/order.routes'));

        // registering variant routes
        fastify.register(require('./modules/variants/variants.routes'));

        // registering delivery areas routes
        fastify.register(require('./modules/delivery-areas/delivery-areas.routes'));

        // starting server
        fastify.listen({port:3000}, err =>{
            if (err) throw new err 
            console.log(`Server listening on ${fastify.server.address().port}`)
        })
    }catch (error){
        console.log('Database connection failed', error);
    }
}
setupDatabase();
