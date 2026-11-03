-- DropIndex
DROP INDEX "Embedding_vector_hnsw_idx";

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL DEFAULT 'resume',
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

