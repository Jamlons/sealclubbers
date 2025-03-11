import { endpoint } from '@/utils/endpoint'

export async function FetchUserData(searchQuery: string) {

  const response = await fetch(`${endpoint}/api/fetchUserData?query=${searchQuery}`);

  if (!response.ok) {
    throw new Error(`${endpoint}/api/fetchUserData?query=${searchQuery}`);
  }
  return response.json();
}