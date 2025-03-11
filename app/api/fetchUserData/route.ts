import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('query');

  if (!searchQuery) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } } // Sometimes APIs reject default fetch requests
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const playersJSON = await response.json();
    
    const res = NextResponse.json(playersJSON.data);
    res.headers.set('Access-Control-Allow-Origin', '*'); // Add CORS
    return res;
  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
