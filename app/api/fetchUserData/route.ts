import { NextResponse } from 'next/server';

// Returns nickname and account_id of players.
// If nickname is an identical match, return only the matched player.
// Otherwise, return list of all players.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('query');

  if (!searchQuery) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const players = await fetch(`https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}`);

    if (!players.ok) {
      throw new Error(`API failed with status ${players.status}, response: ${await players.text()}`);
    }

    const playersJSON = await players.json();

    // Create response with CORS headers
    const response = NextResponse.json(playersJSON.data);  // Pass only the data as the body of the response
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins or replace '*' with specific origin for security
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;

  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
