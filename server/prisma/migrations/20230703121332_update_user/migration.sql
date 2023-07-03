-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT');

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "sounds" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'LIGHT';
