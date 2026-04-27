-- Enums for intake regimen lines
CREATE TYPE "RegimenUsageSlot" AS ENUM ('UNKNOWN', 'AM', 'PM', 'BOTH');

CREATE TYPE "RegimenLineSource" AS ENUM ('PICKED', 'FREE_TEXT');

CREATE TABLE "SkincareProduct" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "market" TEXT,
    "activesSummary" TEXT,
    "ingredientsJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkincareProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SkincareProduct_slug_key" ON "SkincareProduct"("slug");

CREATE INDEX "SkincareProduct_brand_idx" ON "SkincareProduct"("brand");

CREATE INDEX "SkincareProduct_isActive_idx" ON "SkincareProduct"("isActive");

CREATE TABLE "CaseRegimenLine" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "usageSlot" "RegimenUsageSlot" NOT NULL DEFAULT 'UNKNOWN',
    "productId" TEXT,
    "brandRaw" TEXT NOT NULL,
    "nameRaw" TEXT NOT NULL,
    "userNote" TEXT,
    "source" "RegimenLineSource" NOT NULL DEFAULT 'PICKED',
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "CaseRegimenLine_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CaseRegimenLine_caseId_idx" ON "CaseRegimenLine"("caseId");

CREATE INDEX "CaseRegimenLine_productId_idx" ON "CaseRegimenLine"("productId");

ALTER TABLE "CaseRegimenLine" ADD CONSTRAINT "CaseRegimenLine_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CaseRegimenLine" ADD CONSTRAINT "CaseRegimenLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "SkincareProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
