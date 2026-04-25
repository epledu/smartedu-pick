-- Add unique constraint on (userId, provider) for Point table
-- Required for upsert operations in /api/points route
CREATE UNIQUE INDEX IF NOT EXISTS "Point_userId_provider_key" ON "Point"("userId", "provider");
