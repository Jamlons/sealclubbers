'use client';

import { useEffect, useState } from 'react';

// Function to fetch user data based on search query
async function FetchUserData(searchQuery: string) {
  const data = await fetch(`https://api.worldoftanks.asia/wot/account/list/?application_id=3b261491699b1febc9a68a1b3e6c7052&search=${searchQuery}`);
  const users = await data.json();
  return users.data;
}

// Search logic to handle the input change and submit
function SearchForUser({ onSearch }: { onSearch: (searchQuery: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery); // Call the parent function to handle the search
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

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    const userData = await FetchUserData(searchQuery); // Fetch user data based on the search query
    setUsers(userData);
    setLoading(false);
  };

  let load = '';
  if (loading) {
    load = "Loading...";
  }

  return (
    <div>
      {load}
      <SearchForUser onSearch={handleSearch} />
      <ul>
        {users.map((user) => (
          <li key={user.account_id}>{user.nickname}</li>
        ))}
      </ul>
    </div>
  );
}