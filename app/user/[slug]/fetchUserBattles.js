require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch application ID from .env
const API_KEY = process.env.WOT_APPLICATION_ID_ASIA;
const BASE_ACCOUNT_URL = "https://api.worldoftanks.asia/wot/account/list/";
const BASE_TANK_URL = "https://api.worldoftanks.asia/wot/tanks/stats/";

// Get the nickname passed in (this will come from your website)
async function fetchAndSaveUserBattleData(nickname) {
  try {
    // Step 1: Check if the nickname exists in the database
    const user = await prisma.user.findUnique({
      where: { nickname: nickname },
    });

    let accountId;

    // If user found in the database, use their accountId
    if (user) {
      accountId = user.accountId;
    } else {
      // Step 2: If not found in DB, call the World of Tanks API to fetch accountId

      const response = await axios.get(BASE_ACCOUNT_URL, {
        params: {
            application_id: API_KEY,
            search: nickname,
            type: "exact",
        },
      });

      if (response.data.meta.count === 1) {
        // Save the nickname and accountId in the database
        accountId = response.data.data[0].account_id;
        await prisma.user.create({
          data: {
            nickname: nickname,
            accountId: accountId,
          },
        });
      } else {
        // Step 3: If no player found, return an error
        return {
          status: 'error',
          message: `No player "${nickname}" exists.`,
        };
      }
    }

    // Step 4: Fetch the tank data for the accountId

    const tankResponse = await axios.get(BASE_TANK_URL, {
        params: {
            application_id: API_KEY,
            account_id: accountId,
            fields: "-clan,-company,-globalmap,-stronghold_defense,-stronghold_skirmish,-team,-regular_team,-all",
            extra: "random",
        },
    });

    const tanksData = tankResponse.data.data[accountId];

    // Step 5: Iterate over each tank and save its stats in the database
    const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp

    for (let tank of tanksData) {
        const tankId = tank.tank_id;
        const stats = tank.random;
      
        // Save each tank's stats to the database
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
                        return 0; // Avoid division by zero
                    }
        
                    const percentage = (hits / shots) * 100;
                    return parseFloat(percentage.toFixed(2)); // Rounded to 2 decimal places
                })(),
                survivedBattles: stats.survived_battles,
                createdAt: currentTime,
            
                // Connect to existing user and tank (using connect for user)
                user: {
                connect: { accountId: accountId },
                },
                tankDetails: {
                connect: { tankId: tankId },
                },
            },
        });
    }

    // Step 6: Return success response with accountId
    return {
      status: 'ok',
      accountId: accountId,
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
