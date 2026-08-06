const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('./product.service');

async function createProductHandler(req, reply) {
    try {
        const product = await createProduct(req.body, req.user.id);
        return reply.status(201).send(product);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function getAllProductsHandler(req, reply) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 32;
        const filters = {
            search: req.query.search,
            category_id: req.query.category_id,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            is_featured: req.query.is_featured
        };
        const products = await getAllProducts(page, limit, filters);
        return reply.send(products);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function getProductByIdHandler(req, reply) {
    try {
        const product = await getProductById(req.params.id);
        return reply.send(product);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function updateProductHandler(req, reply) {
    try {
        const product = await updateProduct(req.params.id, req.body);
        return reply.send(product);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function deleteProductHandler(req, reply) {
    try {
        const result = await deleteProduct(req.params.id);
        return reply.send(result);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

module.exports = { 
    createProduct: createProductHandler, 
    getAllProducts: getAllProductsHandler, 
    getProductById: getProductByIdHandler, 
    updateProduct: updateProductHandler, 
    deleteProduct: deleteProductHandler 
};