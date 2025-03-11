export async function FetchTankData(searchQuery: string) {
    const response = await fetch(`/api/fetchTankData?query=${searchQuery}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tank data');
  }
  return response.json();
}
  