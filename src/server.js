require('dotenv').config({path: require('path').join(__dirname, '../.env')});
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const fastify = require('fastify')();
const sequelize = require('./config/database'); 


async function setupDatabase() {
    try{
        await sequelize.authenticate();
        console.log('Database connected');

        await sequelize.sync();
        console.log('Tables Synced');

        // registering auth routes
        fastify.register(require('./modules/auth/auth.routes'));

        // registering product routes
        fastify.register(require('./modules/products/product.routes'));

        // registring category routes
        fastify.register(require('./modules/categories/category.routes'));

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
