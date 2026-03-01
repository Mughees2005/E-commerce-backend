// database/seeders/01-roles.js
const { Role } = require('../models/index');

async function seedRoles() {
    try {
        console.log('Seeding roles...');
        
        const roles = [
            { name: 'super_admin', description: 'Full system access' },
            { name: 'product_manager', description: 'Can manage products' },
            { name: 'customer', description: 'Regular customer' },
            { name: 'editor', description: 'Can edit products' }
        ];
        
        // Bulk create - professional 
        await Role.bulkCreate(roles, {
            ignoreDuplicates: true,  // if data already exist, ignore it
            updateOnDuplicate: ['description']  // if name is same then update the description
        });
        
        console.log('Roles seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
}

module.exports = seedRoles;