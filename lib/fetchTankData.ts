import { endpoint } from '@/utils/endpoint'

export async function FetchTankData(searchQuery: string) {
    const response = await fetch(`${endpoint}/api/fetchTankData?query=${searchQuery}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tank data');
  }
  return response.json();
}
  