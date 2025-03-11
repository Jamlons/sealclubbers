export async function FetchTankData(searchQuery: string) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : 'http://localhost:3000'; // Or the appropriate server URL
  
    // Create the full URL by concatenating the base URL and the relative API path
    const url = `${baseUrl}/api/fetchTankData?query=${searchQuery}`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error('Failed to fetch tank data');
    }
    return response.json();
}
  