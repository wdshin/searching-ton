/*
  Warnings:

  - You are about to drop the `NFTDomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NFTDomain";

-- CreateTable
CREATE TABLE "NftDomain" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "NftDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NftDomain_address_key" ON "NftDomain"("address");
