const { addVariant, getVariants, updateVariant, deleteVariant } = require('./variants.service');

async function addVariantHandler(req, reply) {
    try {
        const variant = await addVariant(req.params.productId, req.body);
        return reply.status(201).send(variant);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function getVariantsHandler(req, reply) {
    try {
        const variants = await getVariants(req.params.productId);
        return reply.send(variants);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function updateVariantHandler(req, reply) {
    try {
        const variant = await updateVariant(req.params.id, req.body);
        return reply.send(variant);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function deleteVariantHandler(req, reply) {
    try {
        const result = await deleteVariant(req.params.id);
        return reply.send(result);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

module.exports = {
    addVariant: addVariantHandler,
    getVariants: getVariantsHandler,
    updateVariant: updateVariantHandler,
    deleteVariant: deleteVariantHandler
};