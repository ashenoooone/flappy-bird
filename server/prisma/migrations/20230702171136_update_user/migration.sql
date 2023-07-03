/*
  Warnings:

  - You are about to drop the `_UserSettingsToSkin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserSettingsToSkin" DROP CONSTRAINT "_UserSettingsToSkin_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSettingsToSkin" DROP CONSTRAINT "_UserSettingsToSkin_B_fkey";

-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "userSettingsId" INTEGER;

-- DropTable
DROP TABLE "_UserSettingsToSkin";

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_userSettingsId_fkey" FOREIGN KEY ("userSettingsId") REFERENCES "UserSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
