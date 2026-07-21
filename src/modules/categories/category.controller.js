const { createCategory, getAllCategories, updateCategory, deleteCategory} = require('./category.service');

async function createCategoryHandler(req, reply) {
    try {
        const category = await createCategory(req.body);
        return reply.status(201).send(category);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function getAllCategoriesHandler(req, reply) {
    try{
        const categories = await getAllCategories();
        return reply.send(categories);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

async function updateCategoryHandler(req, reply) {
    try{
        const category = await updateCategory(req.params.id, req.body);
        return reply.send(category);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

async function deleteCategoryHandler(req, reply) {
    try{
        const result = await deleteCategory(req.params.id);
        return reply.send(result);
    }catch (error){
        reply.code(500).send({ error: error.message });
    }
}

module.exports = {
    createCategory: createCategoryHandler,
    getAllCategories: getAllCategoriesHandler,
    updateCategory: updateCategoryHandler,
    deleteCategory: deleteCategoryHandler
};