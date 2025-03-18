'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { endpoint } from '@/utils/endpoint'; // Import endpoint

export default function SearchPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${endpoint}/api/fetchUserData?query=${nickname}`);
      const data = await response.json();

      if (data.status === 'ok') {
        console.log('okay');
        // If the API returns 'ok', redirect to the user's page
        router.push(`${endpoint}/user/${nickname}-${data.message}`);
      } else if (data.status === 'error') {
        // If the API returns 'error', display the error message
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while fetching the user data.');
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter nickname"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
