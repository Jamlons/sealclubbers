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
    console.log("getting data")
    const players = await fetch(`https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}`);
    console.log("fetched data")
    const playersJSON = await players.json();
    if (playersJSON.data[0].nickname === searchQuery) {
      console.log('find');
      return NextResponse.json(playersJSON.data[0]);
    }
    return NextResponse.json(playersJSON.data);
  } catch (error) {
    return NextResponse.json({ error: `https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}` }, { status: 500 });
  }
}