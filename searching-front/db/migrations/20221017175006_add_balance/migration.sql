-- AlterTable
ALTER TABLE "NftDomain" ADD COLUMN     "domainName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tonBalance" INTEGER,
ADD COLUMN     "walletAddress" TEXT;
