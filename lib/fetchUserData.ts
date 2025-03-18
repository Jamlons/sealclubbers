import { endpoint } from '@/utils/endpoint'
const fetchAndSaveUserBattleData =  require('./fetchUserBattles.js');

export async function FetchUserData(searchQuery: string) {

  const response = fetchAndSaveUserBattleData(searchQuery);

  if (!response.ok) {
    throw new Error(`${endpoint}/api/fetchUserData?query=${searchQuery}`);
  }
  return response.json();
}