const seedRoles = require('./01-roles');

async function runAllSeeders() {
    console.log('Starting database seeding...');
    
    // maintain order - first roles, then users, etc.
    await seedRoles();
    // await seedUsers();      // 2. Phir users (role_id chahiye)
    // await seedCategories(); // 3. Phir categories
    // await seedProducts();   // 4. Phir products (category_id chahiye)
    
    console.log('Database seeding completed!');
}

module.exports = runAllSeeders;