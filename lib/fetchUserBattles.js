const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_KEY = process.env.WOT_APPLICATION_ID_ASIA;
const BASE_ACCOUNT_URL = "https://api.worldoftanks.asia/wot/account/list/";
const BASE_TANK_URL = "https://api.worldoftanks.asia/wot/tanks/stats/";

/**
 * Loads users battles into the database. Note: Only works if numBattles for a tank, under a user, has changed.
 * 
 * @param {string} nickname - Nickname of the player
 * @returns - Returns account_id on success, error on failure.
 */
async function fetchAndSaveUserBattleData(nickname) {
  try {
    const user = await prisma.user.findUnique({
      where: { nickname: nickname },
    });

    let accountId;
    if (user) {
      accountId = user.accountId;
    } else {

      const response = await axios.get(BASE_ACCOUNT_URL, {
        params: {
            application_id: API_KEY,
            search: nickname,
            type: "exact",
        },
      });

      if (response.data.meta.count === 1) {
        accountId = response.data.data[0].account_id;
        await prisma.user.create({
          data: {
            nickname: nickname,
            accountId: accountId,
          },
        });
      } else {
        return {
          status: 'error',
          message: `No player "${nickname}" exists.`,
        };
      }
    }

    const tankResponse = await axios.get(BASE_TANK_URL, {
        params: {
            application_id: API_KEY,
            account_id: accountId,
            fields: "-clan,-company,-globalmap,-stronghold_defense,-stronghold_skirmish,-team,-regular_team,-all",
            extra: "random",
        },
    });

    const tanksData = tankResponse.data.data[accountId];

    const currentTime = Math.floor(Date.now() / 1000);

    for (let tank of tanksData) {
        const tankId = tank.tank_id;
        const stats = tank.random;
      
        try {
          await prisma.userTankStats.create({
              data: {
                  markOfMastery: tank.mark_of_mastery,
                  totXp: stats.xp,
                  numBattles: stats.battles,
                  draws: stats.draws,
                  wins: stats.wins,
                  losses: stats.losses,
                  dmgDealt: stats.damage_dealt,
                  spots: stats.spotted,
                  frags: stats.frags,
                  capPointsDropped: stats.dropped_capture_points,
                  maxDmg: stats.max_damage,
                  maxFrag: stats.max_frags,
                  maxXp: stats.max_xp,
                  assisted: stats.track_assisted_damage + stats.stun_assisted_damage + stats.radio_assisted_damage,
                  hitsPercent: (() => {
                      const hits = stats.hits || 0;
                      const shots = stats.shots || 0;
          
                      if (shots === 0) {
                          return 0; 
                      }
          
                      const percentage = (hits / shots) * 100;
                      return parseFloat(percentage.toFixed(2));
                  })(),
                  survivedBattles: stats.survived_battles,
                  createdAt: currentTime,
              
                  user: {
                  connect: { accountId: accountId },
                  },
                  tankDetails: {
                  connect: { tankId: tankId },
                  },
              },
          });
        } catch (error) {
          if (error.code === 'P2002') {
            console.log('Record with the same accountId, tankId, and numBattles already exists');
          } else {
            console.error('An unexpected error occurred:', error);
          }
        }
    }
    return {
      status: 'ok',
      message: accountId,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      status: 'error',
      message: 'An error occurred while fetching data.',
    };
  }
}

module.exports = fetchAndSaveUserBattleData;
