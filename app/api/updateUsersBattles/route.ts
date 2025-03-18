import { NextResponse } from 'next/server';
import fetchAndSaveUserBattleData from '@/lib/updateUsersBattles.js';

/**
 * Handles GET requests to fetch User.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('query');

    if (!searchQuery) {
      return new NextResponse(JSON.stringify({ message: 'Missing query parameter' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    let account_id_int = Number(searchQuery);
    if (isNaN(account_id_int)) {
        return new NextResponse(JSON.stringify({ message: 'Account ID passed is not a number.' }), {
            status: 400,
            headers: corsHeaders,
        });
    }
    
    const response = await fetchAndSaveUserBattleData(account_id_int);

    if (response.status === "error") {
      return new NextResponse(JSON.stringify({ message: response.message}), {
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return new NextResponse(JSON.stringify(response.message), { status: 200, headers: corsHeaders });

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
