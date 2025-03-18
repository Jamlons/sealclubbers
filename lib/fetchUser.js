const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const BASE_ACCOUNT_URL = "https://api.worldoftanks.asia/wot/account/list/";

/**
 * Fetches basic user information and caches it to the database.
 * @param {String} givenNickname
 * @returns {Promise<{status: string, message: string|Object}>} on success returns User object in message. On fail, returns error in message.
 */
async function fetchUser(givenNickname) {
    const user = await prisma.user.findUnique({
        where: { nickname: givenNickname },
    });
    
    if (user) {
        return {
            status: 'ok',
            message: user,
        }
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
            return {
                status: 'ok',
                message: {
                    nickname: nickname,
                    accountId: accountId,
                }
            }
        } else {
            return {
            status: 'error',
            message: `No player "${nickname}" exists.`,
            };
        }
    }
}

module.exports = fetchUser;