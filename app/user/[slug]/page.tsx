'use client';

import { FetchUsersTanks } from '@/lib/fetchUsersTanks'
import { FetchTankData } from '@/lib/fetchTankData'
import { useState, useEffect } from 'react'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [tanks, setTanks] = useState<unknown[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [nickname, setNickname] = useState<string | null>(null)
    const [accountId, setAccountId] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Resolve the params promise to get slug
                const { slug } = await params
                const [nickname, account_id] = slug.split('-')
                setNickname(nickname)
                setAccountId(account_id)

                // Fetch the tank data
                const tankData = await FetchUsersTanks(account_id)

                // Fetch additional tank data for each tank
                const updatedTanks = await Promise.all(
                    tankData.map(async (tank) => {
                        const tankStats = await FetchTankData(tank.tank_id)
                        return { ...tank, stats: tankStats }
                    })
                )

                setTanks(updatedTanks)
            } catch (err) {
                setError('Failed to load data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [params])  // Use the `params` dependency to trigger the effect

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    console.log(tanks);

    return (
        <div>
            <h1>{nickname}</h1>
            <ul>
                {tanks.map((tank) => (
                    <li key={tank.tank_id}>
                        Tank: {tank.stats[tank.tank_id].short_name} Win-Rate: {((tank.statistics.wins / tank.statistics.battles) * 100).toFixed(2)}% WN8: 
                    </li>
                ))}
            </ul>
        </div>
    )
}
