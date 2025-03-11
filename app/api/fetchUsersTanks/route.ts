import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerID = searchParams.get('query');

  if (!playerID) {
    return NextResponse.json({ error: 'Missing playerID' }, { status: 400 });
  }

  try {
    console.log("test")
    const playerData = await fetch(`https://api.worldoftanks.asia/wot/account/tanks/?application_id=3b261491699b1febc9a68a1b3e6c7052&account_id=${playerID}`) 
    const playerDataJSON = await playerData.json();

    const response = NextResponse.json(playerDataJSON.data[playerID]);
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins or replace '*' with specific origin for security
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    return response;

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}