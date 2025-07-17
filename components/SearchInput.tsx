"use client";

import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    // Navigate to search page
    router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);

    // Reset loading state after a short delay
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full flex items-center px-5 rounded-full border-white bg-white border shadow-lg">
      <Link href="/">
        <HomeIcon className="h-10 w-10 text-gray-300 hover:text-gray-500 transition-colors" />
      </Link>

      <input
        type="text"
        className="flex-1 p-5 outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="What type of film do you like? e.g. Sci-Fi films in space..."
      />

      <button
        onClick={handleSearch}
        disabled={!searchTerm.trim() || isSearching}
        className="ml-2 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title="Search"
      >
        {isSearching ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <MagnifyingGlassIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default SearchInput;
