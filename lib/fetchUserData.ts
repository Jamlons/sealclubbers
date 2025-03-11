import { endpoint } from '@/utils/endpoint'

export async function FetchUserData(searchQuery: string) {
  console.log(`${endpoint}/api/fetchUserData?query=${searchQuery}`)
  const response = await fetch(`${endpoint}/api/fetchUserData?query=${searchQuery}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}
  