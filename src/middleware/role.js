function requireRole(...roles) {
    return async function(req, reply) {
        if (!roles.includes(req.user.role_id)) {
            return reply.code(403).send({ error: 'Access denied' });
        }
    }
}
module.exports = requireRole;