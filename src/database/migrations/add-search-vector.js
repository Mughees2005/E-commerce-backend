const sequelize = require('../../config/database');

async function addSearchVector() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // Add search_vector column
        await sequelize.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS search_vector tsvector;
        `);

        // Create GIN index
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS products_search_vector_idx 
            ON products USING GIN(search_vector);
        `);

        // Create trigger function
        await sequelize.query(`
            CREATE OR REPLACE FUNCTION update_product_search_vector()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.search_vector := to_tsvector('english', COALESCE(NEW.name, ''));
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Create trigger
        await sequelize.query(`
            DROP TRIGGER IF EXISTS product_search_vector_trigger ON products;
            CREATE TRIGGER product_search_vector_trigger
            BEFORE INSERT OR UPDATE OF name ON products
            FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();
        `);

        // Update existing products
        await sequelize.query(`
            UPDATE products SET search_vector = to_tsvector('english', COALESCE(name, ''));
        `);

        console.log('Search vector migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

addSearchVector();