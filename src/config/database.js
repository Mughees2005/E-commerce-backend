const {sequelize} = require('sequelize')

const sequelize = new Sequelize('ecommerce', 'admin', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false
});
module.exports = sequelize;