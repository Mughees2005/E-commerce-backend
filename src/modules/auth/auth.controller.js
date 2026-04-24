const {registerUser, loginUser, getUserProfile, createGuestUser} = require('../auth/auth.service');

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

module.exports = {
    register,
    login,
    createGuest,
    getProfile
};