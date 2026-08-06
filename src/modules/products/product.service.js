const { where } = require('sequelize');
const { Product, ProductImage, Category } = require('../../database/models/index');
const { setCache, getCache, deleteCache, deleteCacheByPattern } = require('../../config/cache');
const { Op } = require('sequelize');

// Auto-generate slug from product name
// Example: "A4 Paper" → "a4-paper"
function generateSlug(name) {
    return name
        .toLowerCase()           // "A4 Paper" → "a4 paper"
        .trim()                  // remove extra spaces
        .replace(/\s+/g, '-')   // spaces → hyphens: "a4 paper" → "a4-paper"
        .replace(/[^\w-]/g, ''); // remove special characters
}

// Auto-generate SKU based on last product's SKU
async function generateSKU() {
    const lastProduct = await Product.findOne({
        order: [['createdAt', 'DESC']]
    });
    
    if (!lastProduct) return 'SKU-1';
    
    const lastNumber = parseInt(lastProduct.sku.replace('SKU-', ''));
    return `SKU-${lastNumber + 1}`;
}

async function createProduct(productData, userId){
    const {name, description, price, compare_at_price, quantity, category_id, is_featured, is_unlimited, low_stock_threshold } = productData;
    // slug auto-generate from name
    let slug = generateSlug(name);
    // Auto-generate SKU based on last product's SKU
    const sku = productData.sku || await generateSKU();

    // check if slug already exists — add number if duplicate
    const slugExists = await Product.findOne({ where: { slug } });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    // check if sku exist
    const skuExists = await Product.findOne( {where: {sku}});
    if(skuExists) throw new Error('SKU already exists');

    // check if category exists
    const category = await Category.findByPk(category_id);
    if(!category) throw new Error('Category not found');

    // if unlimited, set quantity and threshold to null
    if (is_unlimited) {
        quantity = null;
        low_stock_threshold = null;
    }

    // if not unlimited, quantity required
    if (!is_unlimited && (quantity === null || quantity === undefined)) {
        throw new Error('Quantity is required when product is not unlimited');
    }

    const product = await Product.create({
        name,
        slug, 
        description,
        price,
        compare_at_price: compare_at_price || null,
        sku: sku,
        is_unlimited: is_unlimited || false,
        quantity: is_unlimited ? null : quantity,
        low_stock_threshold: is_unlimited ? null : (low_stock_threshold || null),
        category_id,
        is_active: true,
        is_featured: is_featured || false,
        created_by: userId
    });

    // Clear products cache when new product is added
    await deleteCacheByPattern('products:*');

    return product;
}


async function getAllProducts(page = 1, limit = 32, filters = {}) {
    const { search, category_id, minPrice, maxPrice, is_featured } = filters;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {
        is_active: true
    };

    // Search by product name
    if (search) {
        where.name = {
            [Op.iLike]: `%${search}%`
        };
    }

    // Category filter
    if (category_id) {
        where.category_id = category_id;
    }

    // Price filter
    if (minPrice || maxPrice) {
        where.price = {};

        if (minPrice) {
            where.price[Op.gte] = minPrice;
        }

        if (maxPrice) {
            where.price[Op.lte] = maxPrice;
        }
    }

    // Featured filter
    if (is_featured) {
        where.is_featured = true;
    }

    // Cache key (includes filters)
    const cacheKey = `products:page:${page}:limit:${limit}:filters:${JSON.stringify(filters)}`;

    // Check cache first
    const cached = await getCache(cacheKey);
    if (cached) {
        console.log("Products from cache");
        return cached;
    }

    const { count, rows } = await Product.findAndCountAll({
        where,
        include: [
            {
                model: Category,
                attributes: ["id", "name"]
            },
            {
                model: ProductImage,
                attributes: ["image_url", "alt_text", "is_primary"]
            }
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });

    const result = {
        products: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    };

    // Cache for 10 minutes
    await setCache(cacheKey, result, 600);

    return result;
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

    // if unlimited, set quantity and threshold to null
    if (updateData.is_unlimited) {
        updateData.quantity = null;
        updateData.low_stock_threshold = null;
    }

    // if not unlimited, quantity required
    if (updateData.is_unlimited === false && (updateData.quantity === null || updateData.quantity === undefined)) {
        throw new Error('Quantity is required when product is not unlimited');
    }

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