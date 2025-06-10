// src/services/likesService.js
export async function sendLike(likedUserId, token) {
  const res = await fetch(`/api/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ likedUserId })
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

//get who liked you
export async function getLikes(token) {
  const res = await fetch(`/api/like/liked-me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'  

  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch likes');
  }

  // returns an array of User objects (populated with name & profile)
  return res.json();
}
