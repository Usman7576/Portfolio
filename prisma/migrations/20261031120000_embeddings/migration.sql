-- CreateTable
CREATE TABLE "Embedding" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "chunk" TEXT NOT NULL,
    "vector" vector(768) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Embedding_sourceType_sourceId_idx" ON "Embedding"("sourceType", "sourceId");


-- Approximate nearest-neighbour index for cosine similarity (the chatbot's retrieval query).
CREATE INDEX "Embedding_vector_hnsw_idx" ON "Embedding" USING hnsw ("vector" vector_cosine_ops);
