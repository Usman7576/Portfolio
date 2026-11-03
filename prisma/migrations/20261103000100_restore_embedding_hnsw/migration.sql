-- The previous migration's auto-generated diff dropped this index, because Prisma can't represent
-- HNSW indexes on Unsupported columns. Delete any such DROP INDEX line from future generated diffs.
CREATE INDEX "Embedding_vector_hnsw_idx" ON "Embedding" USING hnsw ("vector" vector_cosine_ops);
