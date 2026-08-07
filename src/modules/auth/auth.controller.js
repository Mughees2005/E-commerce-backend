const {registerUser, loginUser, getUserProfile, createGuestUser} = require('../auth/auth.service');
const { Role, User } = require('../../database/models/index');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function register(req, reply) {
    try{
        // const { email, password, full_name, phone } = req.body;
        // const result = await registerUser(email, password, full_name, phone);
        const result = await registerUser(req.body);
        return reply.status(201).send(result);
    }catch (error){
        reply.code(500).send({error: error.message})
    }
}

async function login(req, reply) {
    try{
        const {email, password}  = req.body;
        const {user, token} = await loginUser(email, password);
        // const result = await loginUser(req.body);
        reply.send({message: 'login done', user: user, token})
    }catch (error){
        reply.code(500).send({error: error.message})
    }
}

async function createGuest(req, reply) {
    try{
        // const session_id = req.body.session_id || `sess_${Date.now()}`;
        // const result = await createGuestUser(session_id);
        const result = await createGuestUser(req.body.session_id || `sess_${Date.now()}`)
        return reply.send(result)
    }catch (error) {reply.code(500).send({error: error.message})}
}

async function getProfile(req, reply) {
    try{
        // req.user will come from middleware after token verification
        const result = await getUserProfile(req.user.id);
        return reply.send(result)
    }catch (error){
        reply.code(500).send({error: error.message});
    }
}

async function googleCallback(req, reply) {
    try {
        // get token from Google
        const { token } = await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
        
        // get user info from google
        const googleUser = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${token.access_token}` }
        });

        const { id, email, name } = googleUser.data;

        // Check if user already exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // create new user 
            const customerRole = await Role.findOne({ where: { name: 'customer' } });
            user = await User.create({
                email,
                full_name: name,
                google_id: id,
                role_id: customerRole.id,
                is_guest: false,
                email_verified: true
            });
        } else {
            // update Google ID 
            await user.update({ google_id: id });
        }

        // create JWT token 
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id, is_guest: user.is_guest },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return reply.send({ user: { id: user.id, email: user.email, full_name: user.full_name }, token: jwtToken });
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    createGuest,
    getProfile,
    googleCallback
};