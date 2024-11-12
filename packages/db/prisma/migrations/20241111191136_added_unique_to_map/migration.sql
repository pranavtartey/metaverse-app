/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Map` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Map_id_key" ON "Map"("id");
