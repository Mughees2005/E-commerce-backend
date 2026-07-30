const { Category } = require('../../database/models/index');
const { setCache, getCache, deleteCache, deleteCacheByPattern } = require('../../config/cache');

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

    await deleteCacheByPattern('categories:*');
    return category;
}

async function getAllCategories() {
    // Check cache first
    const cache = await getCache('categories:all');
    if (cache) {
        console.log('Categories from cache');
        return cached;
    }

    const categories = await Category.findAll({
        where: { is_active: true },
        include: [
            { model: Category, as: 'subcategories', attributes: ['id', 'name', 'slug', 'description', 'parent_id'], where: { is_active: true}, require: false }
        ]
    });

    // Save to cache for 1 hour
    await setCache('categories:all', categories, 3600);

    return categories;
}

async function updateCategory(id, updateData) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');

    await category.update(updateData);
    
    await deleteCacheByPattern('categories:*');
    return category;
}

async function deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');

    await category.update({ is_active: false });

    await deleteCacheByPattern('categories:*');
    return { message: 'Category deleted successfully' };
}

module.exports = {createCategory, getAllCategories, updateCategory, deleteCategory};