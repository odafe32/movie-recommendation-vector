"use client";

import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    setIsSearching(true);

    try {
      // Navigate to search page
      router.push(`/search/${encodeURIComponent(trimmedTerm)}`);

      // Optional: Save to search history in localStorage
      const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      const updatedHistory = [
        trimmedTerm,
        ...searchHistory.filter((term: string) => term !== trimmedTerm),
      ].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Navigation failed:", error);
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setIsSearching(false), 500);
    }
  }, [searchTerm, router]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full flex items-center px-5 rounded-full border-white bg-white border shadow-lg">
      <Link href="/" aria-label="Go to home page">
        <HomeIcon className="h-10 w-10 text-gray-300 hover:text-gray-500 transition-colors" />
      </Link>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-5 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What type of film do you like? e.g. Sci-Fi films in space..."
          aria-label="Search for movies"
          disabled={isSearching}
        />

        {/* Clear button */}
        {searchTerm && !isSearching && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={handleSearch}
        disabled={!searchTerm.trim() || isSearching}
        className="ml-2 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Search movies"
        aria-label="Search movies"
        type="button"
      >
        {isSearching ? (
          <div
            className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            aria-label="Searching..."
          />
        ) : (
          <MagnifyingGlassIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default SearchInput;
