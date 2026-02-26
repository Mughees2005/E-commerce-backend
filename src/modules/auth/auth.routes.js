const {register, login, createGuest, getProfile} = require('../auth/auth.controller');
const { authMiddleware } = require('../../middleware/auth');

async function routes(fastify) {
    // POST /auth/register → register controller
    fastify.post("/auth/register", register);
    fastify.post("/auth/login", login);
    fastify.post("/auth/guest", createGuest);
    // GET /auth/profile → first middleware, then profile controller
    fastify.get("/auth/profile", {preHandler: [authMiddleware]}, getProfile);
}

module.exports = routes;