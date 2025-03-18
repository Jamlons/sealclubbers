'use client';

import { useState, useEffect, useCallback } from 'react';
import { endpoint } from '@/utils/endpoint';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [battles, setBattles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);

    const fetchData = useCallback(async (slug: string) => {
        setLoading(true);
        setError(null);

        try {
            const [nickname, account_id] = slug.split('-');
            if (!nickname || !account_id) {
                setError('Invalid slug format');
                return;
            }

            let account_id_int = Number(account_id);
            if (isNaN(account_id_int)) {
                setError('Account_ID is not a number.')
                return;
            }

            setNickname(nickname);

            const account = await fetch(`${endpoint}/api/updateUsersBattles?query=${account_id_int}`) 
            const accountdet = await account.json();

            if (accountdet.status === 500) {
                setError(accountdet.message);
                return;
            }

            const response = await fetch(`${endpoint}/api/fetchUserBattles?query=${account_id_int}`);
            const battleList = await response.json();

            if (response.status === 500) {
                setError(battleList.message);
                return;
            } else if (response.status === 200) {
                setBattles(battleList.message);
            } else {
                setError('undefined HTTP status recieved.');
            }
        } catch (err) {
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unwrapParams = async () => {
            const { slug } = await params;
            await fetchData(slug);
        };

        unwrapParams();
    }, [params, fetchData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    console.log(battles[0]);

    return (
        <div>
    <h1>{nickname}</h1>
    <table class="border-separate border-spacing-2 border border-gray-400 dark:border-gray-500">
        <thead>
            <tr>
                <th class="border border-gray-300 dark:border-gray-600">Nation</th>
                <th class="border border-gray-300 dark:border-gray-600">Type</th>
                <th class="border border-gray-300 dark:border-gray-600">Tier</th>
                <th class="border border-gray-300 dark:border-gray-600">Tank</th>
                <th class="border border-gray-300 dark:border-gray-600">Icon</th>
                <th class="border border-gray-300 dark:border-gray-600">Games</th>
                <th class="border border-gray-300 dark:border-gray-600">WN8</th>
                <th class="border border-gray-300 dark:border-gray-600">WR</th>
                <th class="border border-gray-300 dark:border-gray-600">DPG</th>
                <th class="border border-gray-300 dark:border-gray-600">Frags</th>
                <th class="border border-gray-300 dark:border-gray-600">MOE</th>
            </tr>
        </thead>
        <tbody>
            {battles.map((battle) => (
                <tr key={battle.tank_id}>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.tankDetails.nation}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.tankDetails.type}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.tankDetails.tier}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.tankDetails.shortName}</td>
                    <td class="border border-gray-300 dark:border-gray-700"><img src={battle.tankDetails.contour_icon} alt="tank icon" /></td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.numBattles}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.wn8}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{(battle.wins / battle.numBattles * 100).toFixed(2)}%</td>
                    <td class="border border-gray-300 dark:border-gray-700">{(battle.dmgDealt / battle.numBattles).toFixed(2)}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{(battle.frags / battle.numBattles).toFixed(2)}</td>
                    <td class="border border-gray-300 dark:border-gray-700">{battle.markOfMastery}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
    );
}
