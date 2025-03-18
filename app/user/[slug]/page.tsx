'use client';

import { useState, useEffect } from 'react';
import { endpoint } from '@/utils/endpoint';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [battles, setBattles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [accountId, setAccountId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const { slug } = await params;
                const [nickname, account_id] = slug.split('-');
                setNickname(nickname);
                setAccountId(account_id);

                const response = await fetch(`${endpoint}/api/fetchUserBattles?query=${account_id}`);
                const battleList = await response.json();

                console.log(battleList.message);
                console.log(battleList.status);

                if (battleList.status === 'error') {
                    setError(battleList.message); 
                    return;
                } else {
                    setBattles(battleList.message); 
                    return
                }
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);  

    if (loading) {
        console.log('loading found');
        return <div>Loading...</div>;
    }
    if (error) {
        console.log('error found');
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{nickname}</h1>
            <ul>
                {battles.map((battle) => (
                    <li key={battle.tank_id}>
                        Nation: {battle.tankDetails.nation} 
                        Type: {battle.tankDetails.type} 
                        Tier: {battle.tankDetails.tier} 
                        <img src={battle.tankDetails.contour_icon}/> 
                        Tank: {battle.tankDetails.name} 
                        Games: {battle.numBattles} 
                        WN8: {battle.wn8} 
                        WR: {battle.wins / battle.numBattles} 
                        DPG: {battle.dmgDealt / battle.numBattles} 
                        Frags: {battle.frags / battle.numBattles} 
                        MOE: {battle.markOfMastery} 
                    </li>
                ))}
            </ul>
        </div>
    );
}