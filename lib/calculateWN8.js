const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

/**
 * Returns the WN8 of a given tank battle statistics.
 * @param {Object} stats JS object of battle statistics directly from Wargaming API. 
 * @param {Integer} tank_id Integer of the given tank ID. Used to find expected values.
 * @returns {Integer} Calculated WN8
 */
export default async function calculateWN8(stats, tank_id) {
    const avgDmg = stats.damage_dealt / stats.battles;
    const avgSpot = stats.spotted / stats.battles;
    const avgFrag = stats.frags / stats.battles;
    const avgDef = stats.dropped_capture_points / stats.battles;
    const avgWinRate = (stats.wins / stats.battles) * 100;
  
    let tankInfo = await prisma.tank.findFirst({
      where: { tankId: tank_id }
    });
  
    const rDAMAGE = parseFloat(avgDmg) / parseFloat(tankInfo.expDamage);
    const rSPOT = parseFloat(avgSpot) / parseFloat(tankInfo.expSpot);
    const rFRAG = parseFloat(avgFrag) / parseFloat(tankInfo.expFrag);
    const rDEF = parseFloat(avgDef) / parseFloat(tankInfo.expDef);
    const rWIN = parseFloat(avgWinRate) / parseFloat(tankInfo.expWinRate);
  
    const rWINc = Math.min(1.8, Math.max(0, (rWIN - 0.71) / (1 - 0.71)));
    const rDAMAGEc = Math.max(0, (rDAMAGE - 0.22) / (1 - 0.22));
    const rFRAGc = Math.max(0, Math.min((rFRAG - 0.12) / (1 - 0.12), rDAMAGEc + 0.2));
    const rSPOTc = Math.max(0, Math.min((rSPOT - 0.38) / (1 - 0.38), rDAMAGEc + 0.1));
    const rDEFc = Math.max(0, Math.min((rDEF - 0.10) / (1 - 0.10), rDAMAGEc + 0.1));
  
    return Math.round(
      (980 * rDAMAGEc) +
      (210 * rDAMAGEc * rFRAGc) +
      (155 * rFRAGc * rSPOTc) +
      (75 * rDEFc * rFRAGc) +
      (145 * Math.min(1.8,rWINc))
    );
}