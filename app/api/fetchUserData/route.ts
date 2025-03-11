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
    const response = await fetch(
      `https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    // Convert headers to a JSON-friendly format
    const headersObj = Object.fromEntries(response.headers.entries());
    const responseBody = await response.text(); // Read response as text

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      headers: headersObj,
      body: responseBody.length > 0 ? JSON.parse(responseBody) : 'No response body'
    });
  } catch (error) {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
