const { Category } = require('../../database/models/index');

async function createCategory(categoryData){
    const {name, slug, description, parent_id} = categoryData;

    // checking if slug already exist
    const slugExists = await Category.findOne( {where: {slug}});
    if (slugExists) throw new Error('Slug already exists');

    const category = await Category.create({
        name, 
        slug, 
        description: description || null,
        parent_id: parent_id || null,
        is_active: true
    });
    return category;
}

async function getAllCategories() {
    const categories = await Category.findAll({
        where: { is_active: true },
        include: [
            { model: Category, as: 'subcategories', attributes: ['id', 'name', 'slug', 'description', 'parent_id'], where: { is_active: true}, require: false }
        ]
    });
    return categories;
}

async function updateCategory(id, updateData) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');

    await category.update(updateData);
    return category;
}

async function deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');

    await category.update({ is_active: false });
    return { message: 'Category deleted successfully' };
}

module.exports = {createCategory, getAllCategories, updateCategory, deleteCategory};