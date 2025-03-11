import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerID = searchParams.get('query');

  if (!playerID) {
    return NextResponse.json({ error: 'Missing playerID' }, { status: 400 });
  }

  try {
    const playerData = await fetch(`https://api.worldoftanks.asia/wot/account/tanks/?application_id=3b261491699b1febc9a68a1b3e6c7052&account_id=${playerID}`) 
    const playerDataJSON = await playerData.json();

    return NextResponse.json(playerDataJSON.data[playerID]);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}