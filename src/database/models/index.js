const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// 1. Roles table
const Role = sequelize.define('Role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true}, // super_admin, product_manager, editor, customer
    description: {type: DataTypes.TEXT}
}, {tableName: 'roles', timestamps: true});

// 2. User table
const User = sequelize.define('User', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password_hash: {type: DataTypes.STRING},
    full_name: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    role_id: {type: DataTypes.INTEGER, references: {model: 'roles', key: 'id'}},
    is_guest: {type: DataTypes.BOOLEAN, defaultValue: false},
    email_verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    last_login: {type: DataTypes.DATE}
}, {tableName: 'user', timestamps: true});

// 3. Address table
const Address = sequelize.define('Address', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    user_id: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'} },
    address_line1: {type: DataTypes.STRING, allowNull: false},
    address_line2: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING, allowNull: false},
    state: {type: DataTypes.STRING, allowNull: false},
    country: {type: DataTypes.STRING, allowNull: false},
    is_default: {type: DataTypes.BOOLEAN, defaultValue: false} // Marks this address as default shipping address for user 
}, {tableName: 'addresses', timestamps:true});

// 4. Categories table
const Categories = sequelize.define('Categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
    slug: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.TEXT},
    parent_id: {type: DataTypes.INTEGER, references: {model: 'categories', key: 'id'}},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true} // If false, category won't show on website (soft delete)
}, {tableName: 'categories', timestamps: true});

// 5. Products Table
const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    compare_at_price: { type: DataTypes.DECIMAL(10, 2) }, // Original/MRP price to show discount (e.g., "Was 100, Now 70")
    cost_price: { type: DataTypes.DECIMAL(10, 2) },
    sku: { type: DataTypes.STRING, unique: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    low_stock_threshold: { type: DataTypes.INTEGER, defaultValue: 5 }, // Send alert when stock goes below this number
    category_id: { type: DataTypes.INTEGER, references: { model: 'categories', key: 'id' } },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } }
}, { tableName: 'products', timestamps: true });

// 6. Product Images Table
const ProductImage = sequelize.define('ProductImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, references: { model: 'products', key: 'id' } },
    image_url: { type: DataTypes.STRING, allowNull: false }, // Path/URL where image is stored (not the actual image)
    alt_text: { type: DataTypes.STRING }, // Text shown if image fails to load (also for SEO)
    is_primary: { type: DataTypes.BOOLEAN, defaultValue: false }, // This image will be shown as main product thumbnail
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 } // Display order of images (0 = first, 1 = second, etc.)
}, { tableName: 'product_images', timestamps: true });

// 7. Orders Table
const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_number: { type: DataTypes.STRING, unique: true },
    user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'), defaultValue: 'pending' },
    payment_status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
    payment_method: { type: DataTypes.ENUM('cod', 'card', 'bank_transfer') },
    subtotal: { type: DataTypes.DECIMAL(10, 2) },
    discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    shipping_cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(10, 2) },
    shipping_address_id: { type: DataTypes.INTEGER, references: { model: 'addresses', key: 'id' } },
    billing_address_id: { type: DataTypes.INTEGER, references: { model: 'addresses', key: 'id' } },
    notes: { type: DataTypes.TEXT },
    placed_at: { type: DataTypes.DATE },
    delivered_at: { type: DataTypes.DATE }
}, { tableName: 'orders', timestamps: true });

// 8. Order Items Table
const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, references: { model: 'orders', key: 'id' } },
    product_id: { type: DataTypes.INTEGER, references: { model: 'products', key: 'id' } },
    product_name: { type: DataTypes.STRING },
    product_price: { type: DataTypes.DECIMAL(10, 2) },
    quantity: { type: DataTypes.INTEGER },
    subtotal: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'order_items', timestamps: true });

// 9. Carts Table
const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    session_id: { type: DataTypes.STRING } // for guests
}, { tableName: 'carts', timestamps: true });

// 10. Cart Items Table
const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cart_id: { type: DataTypes.INTEGER, references: { model: 'carts', key: 'id' } },
    product_id: { type: DataTypes.INTEGER, references: { model: 'products', key: 'id' } },
    quantity: { type: DataTypes.INTEGER },
    price: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'cart_items', timestamps: true });


// Relationships
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });


module.exports = {
    Role,
    User,
    Address,
    Categories,
    Product,
    ProductImage,
    Order,
    OrderItem,
    Cart,
    CartItem
};