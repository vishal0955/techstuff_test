export async function fetchPokemonList(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return {
      results: data.results || [],
      count: data.count || 0,
    };
  } catch (err) {
    throw { message: err.message || "Network error" };
  }
}

export async function fetchPokemonDetail(name) {
  if (!name) return null;
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw { message: err.message || "Network error" };
  }
}