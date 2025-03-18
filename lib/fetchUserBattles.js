const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Returns every battle record for a specified user
 * @param {Integer} account_id
 * @returns {Promise<{status: string, message: string|Object}>} On ok: JS Object of all battles in message. On error: Error message in message
 */
async function fetchUserBattles(account_id) {
    let battles = '';
    try {
        battles = await prisma.userTankStats.findMany({
            where: { accountId: account_id }
        });
    } catch (error) {
        return {
            status: 'error',
            message: error,
        };
    }
    return {
        status: 'ok',
        message: battles,
    };
}

module.exports = fetchUserBattles;