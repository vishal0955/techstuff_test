"use client";
import React, { useEffect, useState, useCallback } from "react";
import { fetchPokemonDetail } from "../../../lib/api";
import Spinner from "../../../components/Spinner";
import ErrorBanner from "../../../components/ErrorBanner";

export default function PokemonDetails({ name }) {
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const fetchDetails = useCallback(async (pokemonName) => {
    if (!pokemonName) return;
    
    setPokemonData(null);
    setIsLoadingDetails(true);
    setDetailsError(null);
    
    try {
      const details = await fetchPokemonDetail(pokemonName);
      setPokemonData(details);
      setSelectedTabIndex(0);
    } catch (err) {
      const errorMessage = err.message || "Failed to load Pokémon details";
      setDetailsError(errorMessage);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    if (!name) {
      setPokemonData(null);
      setDetailsError(null);
      setIsLoadingDetails(false);
      setSelectedTabIndex(0);
      return;
    }
    fetchDetails(name);
  }, [name, fetchDetails]);

  const retryFetchDetails = () => {
    if (name) {
      fetchDetails(name);
    }
  };

  const handleTabKeyboard = (e) => {
    if (!pokemonData || !pokemonData.types) return;
    
    const totalTabs = pokemonData.types.length;
    
    if (e.key === "ArrowRight") {
      setSelectedTabIndex((current) => (current + 1) % totalTabs);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      setSelectedTabIndex((current) => (current - 1 + totalTabs) % totalTabs);
      e.preventDefault();
    }
  };

  const capitalizeText = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Type color mapping for better UI
  const getTypeColor = (typeName) => {
    const colors = {
      normal: "bg-gray-400",
      fire: "bg-orange-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-cyan-400",
      fighting: "bg-red-600",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-700",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-600",
      dark: "bg-gray-700",
      steel: "bg-gray-500",
      fairy: "bg-pink-400",
    };
    return colors[typeName.toLowerCase()] || "bg-gray-400";
  };

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Pokémon Selected</h3>
        <p className="text-sm text-gray-500">Click on a Pokémon name to view its details</p>
      </div>
    );
  }

  if (detailsError) {
    return <ErrorBanner message={detailsError} onRetry={retryFetchDetails} />;
  }

  if (isLoadingDetails || !pokemonData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner />
        <p className="mt-4 text-sm text-gray-600">Loading Pokémon details...</p>
      </div>
    );
  }

  const pokemonTypes = pokemonData.types || [];
  const currentType = pokemonTypes[selectedTabIndex]?.type?.name || "";

  return (
    <div className="space-y-6">
      {/* Pokemon Header Card */}
      <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
        {pokemonData.sprites?.front_default && (
          <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-inner">
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="w-20 h-20 object-contain"
            />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {capitalizeText(pokemonData.name)}
          </h3>
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            ID: #{pokemonData.id}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemonTypes.map((typeInfo) => (
              <span
                key={typeInfo.type.name}
                className={`px-3 py-1 ${getTypeColor(typeInfo.type.name)} text-white rounded-full text-xs font-semibold shadow-sm`}
              >
                {capitalizeText(typeInfo.type.name)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Type Tabs */}
      {pokemonTypes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Type Details
          </h4>
          <div className="flex gap-2 mb-4" role="tablist" aria-label="Pokemon Types">
            {pokemonTypes.map((typeInfo, index) => {
              const isActiveTab = index === selectedTabIndex;
              return (
                <button
                  key={typeInfo.type.name}
                  role="tab"
                  aria-selected={isActiveTab}
                  tabIndex={0}
                  onClick={() => setSelectedTabIndex(index)}
                  onKeyDown={handleTabKeyboard}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${isActiveTab 
                      ? "bg-blue-600 text-white shadow-md transform scale-105" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  type="button"
                >
                  {capitalizeText(typeInfo.type.name)}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            aria-labelledby={`type-tab-${selectedTabIndex}`}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 space-y-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${getTypeColor(currentType)}`}></div>
              <h5 className="text-lg font-bold text-gray-900">
                {capitalizeText(currentType)} Type
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Game Indices
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {pokemonData.game_indices?.length || 0}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Total Moves
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {pokemonData.moves?.length || 0}
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold">Note:</span> These stats represent the total 
                game appearances and available moves for this Pokémon across all versions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}