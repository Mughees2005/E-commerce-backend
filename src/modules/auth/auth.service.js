// require('dotenv').config(); 
const bcrypt = require('bcrypt');
const {Role, User, Address, Categories, Product, ProductImage, Order, OrderItem, Cart, CartItem} = require('../../database/models/index');
const jwt = require('jsonwebtoken');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

async function registerUser(userData) {
    const { email, password, full_name, phone } = userData;

    const userExists = await User.findOne({where: {email}});
    // check user exist or not
    if(userExists){
        throw new Error('User already exist');
    }
    // Get customer role id
    const customerRole = await Role.findOne({where: {name: 'customer'}});
    if(!customerRole) throw new Error('Customer role not found');

    // hash password
    const hash_password = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
        email,
        password_hash: hash_password,
        full_name,
        phone: phone || null,
        role_id: customerRole.id,
        is_guest: false,
        email_verified: false
    })

    // generate jwt token
    const token = jwt.sign(
        {id: user.id, email: user.email, role_id: user.role_id, is_guest: user.is_guest},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    return {user:{id: user.id, email: user.email, full_name: user.full_name}, token}
}

async function loginUser(email, password) {
    // finding user by email
    const user = await User.findOne({where: {email}});
    if(!user) throw new Error("User not found");

    // match password
    const valid = await bcrypt.compare(password, user.password_hash);
    if(!valid) throw new Error('Invalid password');

    // update last login
    await user.update({last_login: new Date() });

    const token = jwt.sign(
        {id: user.id, email: user.email, role_id: user.role_id, is_guest: user.is_guest},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    return {user: {id: user.id, name: user.name, email: user.email}, token};
}

async function createGuestUser(session_id) {
    // get customer role
    const customerRole = await Role.findOne({where: {name: 'customer'}});

    const guest = await User.create({
        email: `guest_${Date.now()}@temp.com`,
        // Generate unique temporary email for guest user using current timestamp
        // guest_1740301234567_0.847562937465@temp.com
        full_name: 'Guest User',
        role_id: customerRole.id,
        is_guest: true,
        email_verified: false
    });

    const token = jwt.sign(
        {id: guest.id, is_guest: true, role_id: guest.role_id},
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRES_IN
    )
    return ({id: guest.id, is_guest: true, session_id: session_id, token});
}


// Fetches user profile from database by user ID
// @param {number} userId - ID of the user
// @returns {Object} User profile (without password)
async function getUserProfile(userId) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'full_name', 'phone', 'created_at']
    });
    if(!user) throw new Error('User not found');

    return user;
}

// Verifies JWT token and returns decoded user data (id, email, role)
async function verifyToken(token) {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Returns user data from token
        }catch (error){
            throw new Error('Invalid or expired token');
        }
}

module.exports = {
    registerUser,
    loginUser,
    createGuestUser,
    getUserProfile,
    verifyToken
}