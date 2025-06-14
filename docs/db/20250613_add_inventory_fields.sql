-- Migration script to extend inventory_items with advanced fields
-- Compatible with PostgreSQL. Run once with psql -f <file> or via any DB client.

-- 1. Create new enum type for origin if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_origin_enum') THEN
        CREATE TYPE inventory_origin_enum AS ENUM ('nacional', 'importada');
    END IF;
END$$;

-- 2. Add new columns (NULLABLE to avoid touching existing rows)
ALTER TABLE inventory_items
    ADD COLUMN IF NOT EXISTS manufacturer VARCHAR,
    ADD COLUMN IF NOT EXISTS origin inventory_origin_enum,
    ADD COLUMN IF NOT EXISTS safety_stock NUMERIC(12,3),
    ADD COLUMN IF NOT EXISTS min_order_qty NUMERIC(12,3),
    ADD COLUMN IF NOT EXISTS package_size VARCHAR;

-- Done
