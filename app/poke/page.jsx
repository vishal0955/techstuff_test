"use client";
import React, { useState } from "react";
import PokemonTable from "./components/PokemonTable";
import PokemonDetails from "./components/PokemonDetails";

export default function Page() {
  const [activePokemon, setActivePokemon] = useState(null);

  const handlePokemonClick = (pokemonName) => {
    setActivePokemon(pokemonName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pokémon Explorer
          </h1>
          <p className="text-gray-600">
            Browse and explore detailed information about your favorite Pokémon
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <PokemonTable onSelect={handlePokemonClick} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <PokemonDetails name={activePokemon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}