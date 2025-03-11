export async function FetchUsersTanks(searchQuery: string) {
    const response = await fetch(`/api/fetchUsersTanks?query=${searchQuery}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user tanks');
  }
  return response.json();
  }
  