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

    throw new Error(`${players}`)
    const playersJSON = await players.json();
    return NextResponse.json(playersJSON.data);

  } catch (error) {
    console.error('Error fetching player data:', error)
    return NextResponse.json({ error: error }, { status: 500 });
  }
}