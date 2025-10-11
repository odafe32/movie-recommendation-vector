import MoviePoster from "@/components/MoviePoster";
import db from "@/db";
import { Movie } from "@/types";
import { Suspense } from "react";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

export const metadata = {
  title: "Browse Movies | AI Movie Recommendations",
  description: "Browse our complete collection of movies",
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen pb-24 pt-8 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm animate-pulse">
              <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Loading...
              </span>
            </div>
          </div>
          <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-lg w-96 mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg w-64 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-zinc-800 h-96 rounded-2xl"></div>
              <div className="mt-4 space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function MoviesList() {
  const movies = db.collection("movies");

  const allMovies = (await movies
    .find(
      {},
      {
        // this is how you exclude out the vector fields from the results
        // projection: { $vector: 0 },
      }
    )
    .toArray()) as Movie[];

  return (
    <div className="min-h-screen pb-24 pt-8 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold dark:text-purple-300 text-dakr uppercase tracking-wider">
                Full Collection
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Browse All Movies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore our collection of <span className="text-purple-400 font-bold">{allMovies.length}</span> handpicked movies
          </p>
        </div>
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {allMovies.map((movie) => (
            <MoviePoster key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MoviesList />
    </Suspense>
  );
}
