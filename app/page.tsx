'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FetchUserData } from '@/lib/fetchUserData'; // Import from lib

function SearchForUser({ onSearch }: { onSearch: (searchQuery: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for a user"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const userData = await FetchUserData(searchQuery);
      setUsers(userData);
      console.log(users[0].nickname)
      if (users[0].nickname === searchQuery) {
        const firstUser = userData[0]; // If there's only one user, use the first element
        console.log(firstUser.nickname); // Access nickname of the first user
        router.push(`/user/${firstUser.nickname}-${firstUser.account_id}`);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <SearchForUser onSearch={handleSearch} />
      <ul>
        {users.length > 0 ? (
          users.map((user, index) => (
            <li key={index}>
              Nickname: {user.nickname}, Account ID: {user.account_id}
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
}
