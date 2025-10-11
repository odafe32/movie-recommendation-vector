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
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
        <div className="relative flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
          <Link href="/" aria-label="Go to home page" className="p-5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors rounded-l-2xl">
            <HomeIcon className="h-6 w-6 text-gray-400 hover:text-purple-400 transition-colors" />
          </Link>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-6 py-5 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for movies... e.g. 'thrilling space adventure'"
              aria-label="Search for movies"
              disabled={isSearching}
            />

            {/* Clear button */}
            {searchTerm && !isSearching && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
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
            className="m-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 disabled:transform-none"
            title="Search movies"
            aria-label="Search movies"
            type="button"
          >
            {isSearching ? (
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                aria-label="Searching..."
              />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
