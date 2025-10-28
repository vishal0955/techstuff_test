"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchPokemonList } from "../../../lib/api";
import Spinner from "../../../components/Spinner";
import ErrorBanner from "../../../components/ErrorBanner";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export default function PokemonTable({ onSelect }) {
  const ROWS_PER_PAGE = 20;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonList, setPokemonList] = useState({ results: [], count: 0 });
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const pageCount = Math.max(1, Math.ceil((pokemonList.count || 0) / ROWS_PER_PAGE));

  // Fetch pokemon list from API
  const getPokemonList = useCallback(async (page) => {
    setFetchingData(true);
    setFetchError(null);
    
    try {
      const data = await fetchPokemonList(page, ROWS_PER_PAGE);
      setPokemonList(data);
    } catch (error) {
      const errorMsg = error.message || "Unable to fetch Pokémon data. Please try again.";
      setFetchError(errorMsg);
    } finally {
      setFetchingData(false);
    }
  }, []);

  useEffect(() => {
    getPokemonList(currentPage);
  }, [currentPage, getPokemonList]);

  const retryFetch = () => {
    getPokemonList(currentPage);
  };

  // Define table columns
  const columns = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    
    return [
      {
        id: "index",
        header: () => <span className="font-semibold">Sr. No.</span>,
        cell: ({ row }) => {
          const serialNum = startIndex + row.index + 1;
          return <span className="text-gray-700 font-medium">{serialNum}</span>;
        },
      },
      {
        accessorKey: "name",
        header: () => <span className="font-semibold">Pokémon Name</span>,
        cell: ({ getValue, row }) => {
          const name = getValue();
          const pokemon = row.original;
          const displayName = name.charAt(0).toUpperCase() + name.slice(1);
          
          return (
            <button
              className={`text-blue-600 hover:text-blue-800 font-medium hover:underline 
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded px-1
                transition-all duration-150 ${fetchingData ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              onClick={() => {
                if (!fetchingData && onSelect) {
                  onSelect(pokemon.name);
                }
              }}
              disabled={fetchingData}
              type="button"
            >
              {displayName}
            </button>
          );
        },
      },
    ];
  }, [currentPage, fetchingData, onSelect]);

  const table = useReactTable({
    data: pokemonList.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Pagination handlers
  const moveToPrevPage = () => {
    if (currentPage > 1 && !fetchingData) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const moveToNextPage = () => {
    if (currentPage < pageCount && !fetchingData) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Show skeleton rows while loading
  const SkeletonRows = () => {
    const rowCount = Math.min(8, ROWS_PER_PAGE);
    
    return Array.from({ length: rowCount }).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="border-b border-gray-100">
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header with page info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pokémon List</h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any Pokémon name to view details
          </p>
        </div>
        <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
          Page <span className="text-blue-600">{currentPage}</span> of {pageCount}
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {fetchingData ? (
                <SkeletonRows />
              ) : fetchError ? (
                <tr>
                  <td colSpan={2} className="px-6 py-4">
                    <ErrorBanner message={fetchError} onRetry={retryFetch} />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination and total count */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            onClick={moveToPrevPage}
            disabled={currentPage === 1 || fetchingData}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg 
              hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed
              font-medium transition-all duration-150 shadow-sm"
            type="button"
          >
            ← Previous
          </button>
          <button
            onClick={moveToNextPage}
            disabled={currentPage === pageCount || fetchingData}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg 
              hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed
              font-medium transition-all duration-150 shadow-sm"
            type="button"
          >
            Next →
          </button>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Total: <span className="text-blue-600 font-bold">{pokemonList.count}</span> Pokémon
        </div>
      </div>
    </div>
  );
}