import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const tankID = searchParams.get('query');

    if (!tankID) {
        return NextResponse.json({ error: 'Missing tankID' }, { status: 400 });
    }

    try {
        const vehicleInfo = await fetch(`https://api.worldoftanks.asia/wot/encyclopedia/vehicles/?application_id=3b261491699b1febc9a68a1b3e6c7052&tank_id=${tankID}&language=en`);
        const tank = await vehicleInfo.json();

        return NextResponse.json(tank.data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}