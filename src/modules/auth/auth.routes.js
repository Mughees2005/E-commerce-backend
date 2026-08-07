const {register, login, createGuest, getProfile, googleCallback} = require('../auth/auth.controller');
const authMiddleware = require('../../middleware/auth');

async function routes(fastify) {
    // POST /auth/register
    fastify.post("/auth/register", {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password', 'full_name', 'phone'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    full_name: { type: 'string', minLength: 1 },
                    phone: { type: 'string', minLength: 10 }
                }
            }
        }
    }, register);

    // POST /auth/login
    fastify.post("/auth/login", {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 1 }
                }
            }
        }
    }, login);

    fastify.post("/auth/guest", createGuest);
    fastify.get("/auth/profile", {preHandler: [authMiddleware]}, getProfile);
    // Google OAuth callback
    fastify.get('/auth/google/callback', googleCallback);
}

module.exports = routes;
