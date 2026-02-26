// This middleware checks if user is authenticated before allowing access to protected routes
const {verifyToken} = require('../modules/auth/auth.service');

async function authMiddleware(req, reply, done) {
    try{
        // Get token from Authorization header
        // Frontend sends token in format: "Bearer <token>"
        // Example: "Bearer eyJhbGciOiJIUzI1NiIs..."
        const token = req.headers.authorization?.split(' ')[1];
        // .split(' ') converts "Bearer token123" to ["Bearer", "token123"]
        // [1] takes the second element which is the actual token
        // ?. prevents error if authorization header is missing

        // if no token return error
        if(!token) {
            return reply.code(401).send({
                success: false,
                message: 'No token provided. Please login first.'
            })
        }

        // Verify the token using the service function
        // verifyToken() checks if token is valid and not expired
        // Returns decoded user data: { id, email, role_id, is_guest }
        const decoded = await verifyToken(token);
        
        // Attach user info to request for use in controllers
        // Example: In controller, we can access req.user.id
        req.user = decoded;

        // Call done() to proceed to the next function (controller)
        // If done() is not called, request will hang forever
        done();
    }catch (error) {
        reply.code(401).send({error: error.message})
    }
}

module.exports = authMiddleware;