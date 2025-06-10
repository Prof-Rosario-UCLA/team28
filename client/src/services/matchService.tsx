//get who liked you
export async function getMatches(token) {
  const res = await fetch(`/api/matches/my-matches`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'  

  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch matches');
  }

  // returns an array of User objects (populated with name & profile)
  return res.json();
}