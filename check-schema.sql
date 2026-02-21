-- Run this in Supabase SQL editor to see your customers table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;
