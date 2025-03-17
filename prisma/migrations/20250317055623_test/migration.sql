-- CreateTable
CREATE TABLE "User" (
    "accountId" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Tank" (
    "tankId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "big_icon" TEXT NOT NULL,
    "contour_icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Tank_pkey" PRIMARY KEY ("tankId")
);

-- CreateTable
CREATE TABLE "UserTankStats" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "tankId" INTEGER NOT NULL,
    "markOfMastery" INTEGER NOT NULL,
    "avgXp" INTEGER NOT NULL,
    "numBattles" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "dmgDealt" INTEGER NOT NULL,
    "spots" INTEGER NOT NULL,
    "frags" INTEGER NOT NULL,
    "capPointsDropped" INTEGER NOT NULL,
    "maxDmg" INTEGER NOT NULL,
    "maxFrag" INTEGER NOT NULL,
    "maxXp" INTEGER NOT NULL,
    "createdAt" INTEGER NOT NULL,

    CONSTRAINT "UserTankStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTankStats" ADD CONSTRAINT "UserTankStats_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTankStats" ADD CONSTRAINT "UserTankStats_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("tankId") ON DELETE RESTRICT ON UPDATE CASCADE;
