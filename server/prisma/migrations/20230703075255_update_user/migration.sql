/*
  Warnings:

  - Made the column `cost` on table `Skin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Skin" ALTER COLUMN "cost" SET NOT NULL;
