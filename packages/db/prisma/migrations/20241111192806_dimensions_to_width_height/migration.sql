/*
  Warnings:

  - You are about to drop the column `dimensions` on the `Map` table. All the data in the column will be lost.
  - Added the required column `height` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "dimensions",
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
