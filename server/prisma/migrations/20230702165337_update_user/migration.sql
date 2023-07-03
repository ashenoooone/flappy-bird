-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "cost" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;
