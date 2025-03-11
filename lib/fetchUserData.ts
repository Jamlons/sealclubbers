export async function FetchUserData(searchQuery: string) {
  const response = await fetch(`/api/fetchUserData?query=${searchQuery}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}
  