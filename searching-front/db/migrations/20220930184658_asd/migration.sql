-- CreateTable
CREATE TABLE "NFTDomain" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "NFTDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFTDomain_address_key" ON "NFTDomain"("address");
