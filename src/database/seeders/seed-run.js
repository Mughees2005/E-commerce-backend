// seed-run.js
// const sequelize = require('./config/database');
const sequelize = require('../../config/database');
const seedRoles = require('./01-roles');

async function run() {
    try {
        await sequelize.authenticate();
        await seedRoles();
        console.log('Seeding done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();