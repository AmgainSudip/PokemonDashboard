import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20"
        );
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (poke) => {
            const res = await fetch(poke.url);
            return await res.json();
          })
        );

        setPokemon(pokemonDetails);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemon.filter((poke) => {
    const matchesSearch = poke.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All"
        ? true
        : poke.types.some((type) => type.type.name === typeFilter);

    return matchesSearch && matchesType;
  });

  const allTypes = [
    "All",
    ...new Set(
      pokemon.flatMap((poke) =>
        poke.types.map((type) => type.type.name)
      )
    ),
  ];

  const averageHeight =
    pokemon.length > 0
      ? (
          pokemon.reduce((sum, poke) => sum + poke.height, 0) /
          pokemon.length
        ).toFixed(1)
      : 0;

  const averageWeight =
    pokemon.length > 0
      ? (
          pokemon.reduce((sum, poke) => sum + poke.weight, 0) /
          pokemon.length
        ).toFixed(1)
      : 0;

  return (
    <div className="container">
      <h1>Pokemon Dashboard</h1>

      <div className="stats">
        <div className="card">
          <h2>{pokemon.length}</h2>
          <p>Total Pokemon</p>
        </div>

        <div className="card">
          <h2>{averageHeight}</h2>
          <p>Average Height</p>
        </div>

        <div className="card">
          <h2>{averageWeight}</h2>
          <p>Average Weight</p>
        </div>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {allTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Height</th>
            <th>Weight</th>
          </tr>
        </thead>

        <tbody>
          {filteredPokemon.map((poke) => (
            <tr key={poke.id}>
              <td>{poke.name}</td>

              <td>
                {poke.types
                  .map((type) => type.type.name)
                  .join(", ")}
              </td>

              <td>{poke.height}</td>

              <td>{poke.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;