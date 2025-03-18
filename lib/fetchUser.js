const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const BASE_ACCOUNT_URL = "https://api.worldoftanks.asia/wot/account/list/";
const API_KEY = process.env.WOT_APPLICATION_ID_ASIA;

/**
 * Fetches basic user information and caches it to the database.
 * @param {String} givenNickname
 * @returns {Promise<{status: string, message: string|Object}>} on success returns User object in message. On fail, returns error in message.
 */
async function fetchUser(givenNickname) {
    let user = 0;
    try {
        user = await prisma.user.findUnique({
            where: {
                nickname: givenNickname,
            },  
        });
    } catch (error) {
        console.log(error);
    }

    if (user) {
        return {
            status: 'ok',
            message: {
                nickname: user.nickname,
                accountId: user.accountId,
            },
        }
    } else {
        const response = await axios.get(BASE_ACCOUNT_URL, {
            params: {
                application_id: API_KEY,
                search: givenNickname,
                type: "exact",
            },
        });

        if (response.data.meta.count === 1) {
            accountId = response.data.data[0].account_id;
            await prisma.user.create({
            data: {
                nickname: givenNickname,
                accountId: accountId,
            },
            });
            return {
                status: 'ok',
                message: {
                    nickname: givenNickname,
                    accountId: accountId,
                }
            }
        } else {
            return {
            status: 'error',
            message: `No player "${givenNickname}" exists.`,
            };
        }
    }
}

module.exports = fetchUser;