'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { endpoint } from '@/utils/endpoint'; // Import endpoint

export default function SearchPage() {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${endpoint}/api/fetchUser?query=${nickname}`);
      const data = await response.json();

      if (response.status === 200) {
        router.push(`${endpoint}/user/${nickname}-${data.accountId}`);
      } else if (response.status === 500 || response.status === 400) {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while fetching the user data.');
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
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
