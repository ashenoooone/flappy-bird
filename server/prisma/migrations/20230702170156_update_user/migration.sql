/*
  Warnings:

  - You are about to drop the column `userSettingsId` on the `Skin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Skin" DROP CONSTRAINT "Skin_userSettingsId_fkey";

-- AlterTable
ALTER TABLE "Skin" DROP COLUMN "userSettingsId";

-- CreateTable
CREATE TABLE "_UserSettingsToSkin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSettingsToSkin_AB_unique" ON "_UserSettingsToSkin"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSettingsToSkin_B_index" ON "_UserSettingsToSkin"("B");

-- AddForeignKey
ALTER TABLE "_UserSettingsToSkin" ADD CONSTRAINT "_UserSettingsToSkin_A_fkey" FOREIGN KEY ("A") REFERENCES "Skin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSettingsToSkin" ADD CONSTRAINT "_UserSettingsToSkin_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
