const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('ecommerce', 'admin', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5441,
    logging: false
});
module.exports = sequelize;