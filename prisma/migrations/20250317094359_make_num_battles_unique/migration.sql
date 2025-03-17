/*
  Warnings:

  - A unique constraint covering the columns `[numBattles]` on the table `UserTankStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserTankStats_numBattles_key" ON "UserTankStats"("numBattles");
