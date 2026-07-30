const { where } = require('sequelize');
const { Product, ProductImage, Category } = require('../../database/models/index');
const { setCache, getCache, deleteCache, deleteCacheByPattern } = require('../../config/cache');

async function createProduct(productData, userId){
    const {name, slug, description, price, compared_at_price, cost_price, sku, quantity, category_id, is_featured } = productData;

    // check if slug already exist
    const slugExists = await Product.findOne({where: { slug }});
    if (slugExists) throw new Error('Slug already exists');

    // check if sku exist
    const skuExists = await Product.findOne( {where: {sku}});
    if(skuExists) throw new Error('SKU already exists');

    // check if category exists
    const category = await Category.findByPk(category_id);
    if(!category) throw new Error('Category not found');

    const product = await Product.create({
        name,
        slug, 
        description,
        price,
        compared_at_price: compared_at_price || null,
        cost_price: cost_price || null,
        sku,
        quantity: quantity || 0,
        category_id,
        is_featured: is_featured || false,
        created_by: userId
    });

    // Clear products cache when new product is added
     deleteCacheByPattern('products:*');

    return product;
}


async function getAllProducts() {
    const cached = await getCache('products:all');
    if (cached){
        console.log('Products from Cache');
        return cached;
    }

    const products = await Product.findAll({
        where: {is_active: true},
        include: [
            {model: Category, attributes: ['id', 'name']},
            { model: ProductImage, attributes: ['image_url', 'alt_text', 'is_primary'] }
        ]
    });

    // Save to cache for 10 minutes
    await setCache('products:all', products, 600);

    return products;
}

async function getProductById(id) {
    // Check cache first
    const cached = await getCache(`products:${id}`);
    if (cached) {
        console.log('Product from cache');
        return cached;
    }

    const product = await Product.findOne({
        where: {id, is_active: true},
        include: [
            { model: Category, attributes: ['id', 'name']},
            { model: ProductImage, attributes: ['image_url', 'alt_text', 'is_primary']}
        ]
    });
    if(!product) throw new Error('Product not found');

    // Save to cache for 10 minutes
    await setCache(`products:${id}`, product, 600);
    return product; 
}

async function updateProduct(id, updateData) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');

    await product.update(updateData);

    // Clear cache for this product and all products list
    await deleteCache(`products:${id}`);
    await deleteCacheByPattern('products:*');

    return product;
}

async function deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Product not found');

    await product.update({is_active: false});

    // Clear cache for this product and all products list
    await deleteCache(`products:${id}`);
    await deleteCacheByPattern('products:*');

    return { message: 'Product deleted successfully'};
}

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };