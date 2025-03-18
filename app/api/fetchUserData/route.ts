import { NextResponse } from 'next/server';
import { endpoint } from '@/utils/endpoint';
import fetchAndSaveUserBattleData from '@/lib/fetchUserBattles';

/**
 * Handles GET requests to fetch user data.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query');

    if (!searchQuery) {
      return new NextResponse(JSON.stringify({ error: 'Missing query parameter' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const response = await fetchAndSaveUserBattleData(searchQuery);

    if (!response.ok) {
      return new NextResponse(JSON.stringify(response), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

/**
 * Handles preflight CORS requests.
 */
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * CORS headers to allow cross-origin requests.
 */
const corsHeaders = new Headers({
  'Access-Control-Allow-Origin': '*', // Change '*' to specific origin for security
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
});
