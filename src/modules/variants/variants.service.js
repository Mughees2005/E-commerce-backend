const { ProductVariant, VariantAttribute, Product } = require('../../database/models/index');

// Auto-generate SKU for variant
async function generateVariantSKU() {
    const lastVariant = await ProductVariant.findOne({
        order: [['createdAt', 'DESC']]
    });

    if (!lastVariant || !lastVariant.sku) return 'SKU-V-1';
    
    const lastNumber = parseInt(lastVariant.sku.replace('SKU-V-', ''));
    return `SKU-V-${lastNumber + 1}`;
}

// Add variant to a product
async function addVariant(productId, variantData) {
    const { combination_name, price, quantity, is_unlimited, low_stock_threshold, attributes } = variantData;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');

    // Validate stock
    if (is_unlimited === false && (quantity === null || quantity === undefined)) {
        throw new Error('Quantity is required when variant is not unlimited');
    }

    const sku = await generateVariantSKU();

    const variant = await ProductVariant.create({
        product_id: productId,
        combination_name,
        price: price || null,
        quantity: is_unlimited ? null : quantity,
        is_unlimited: is_unlimited || false,
        low_stock_threshold: is_unlimited ? null : (low_stock_threshold || null),
        sku,
        is_active: true
    });

    // Add attributes (Color, Size etc)
    if (attributes && attributes.length > 0) {
        for (const attr of attributes) {
            await VariantAttribute.create({
                variant_id: variant.id,
                attribute_name: attr.name,
                attribute_value: attr.value
            });
        }
    }

    const variantWithAttributes = await ProductVariant.findByPk(variant.id, {
        include: [{ model: VariantAttribute }]
    });

    return variantWithAttributes;
}

// Get all variants of a product
async function getVariants(productId) {
    const variants = await ProductVariant.findAll({
        where: { product_id: productId, is_active: true },
        include: [{ model: VariantAttribute }]
    });
    return variants;
}

// Update variant
async function updateVariant(variantId, updateData) {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) throw new Error('Variant not found');

    if (updateData.is_unlimited) {
        updateData.quantity = null;
        updateData.low_stock_threshold = null;
    }

    await variant.update(updateData);
    return variant;
}

// Delete variant (soft delete)
async function deleteVariant(variantId) {
    const variant = await ProductVariant.findByPk(variantId);
    if (!variant) throw new Error('Variant not found');

    await variant.update({ is_active: false });
    return { message: 'Variant deleted successfully' };
}

module.exports = { addVariant, getVariants, updateVariant, deleteVariant };