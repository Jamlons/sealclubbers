/*
  Warnings:

  - A unique constraint covering the columns `[accountId,tankId,numBattles]` on the table `UserTankStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserTankStats_numBattles_key";

-- CreateIndex
CREATE INDEX "UserTankStats_accountId_tankId_idx" ON "UserTankStats"("accountId", "tankId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTankStats_accountId_tankId_numBattles_key" ON "UserTankStats"("accountId", "tankId", "numBattles");
