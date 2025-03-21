import { NextResponse } from 'next/server';
import fetchUserBattles from '@/lib/fetchUserBattles.js';

/**
 * Handles GET requests to fetch user battles.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query');
    let accountId = 0;

    if (!searchQuery) {
      return new NextResponse(JSON.stringify({ message: 'Missing query parameter' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    accountId = Number(searchQuery);

    if (isNaN(accountId)) {
      return new NextResponse(JSON.stringify({ message: 'Given query parameter is not a number.'}), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const response = await fetchUserBattles(accountId);

    if (response.status === "error") {
      return new NextResponse(JSON.stringify({message: response.message}), {
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return new NextResponse(JSON.stringify({message: response.message}), { status: 200, headers: corsHeaders });

  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
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
