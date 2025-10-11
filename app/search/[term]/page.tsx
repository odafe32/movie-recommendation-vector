import MoviePoster from "@/components/MoviePoster";
import db from "@/db";
import { Movie } from "@/types";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

async function SearchTerm({
  params: { term },
}: {
  params: {
    term: string;
  };
}) {
  const movies = db.collection("movies"); // Changed from "movviee_db" to "movies"

  const similarMovies = (await movies
    .find(
      {},
      {
        vectorize: term,
        limit: 10,
        // Do not include vectors in the output.
        projection: { $vector: 0 },
      }
    )
    .toArray()) as Movie[];

  return (
    <div className="min-h-screen bg-white dark:bg-black px-4 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Search Results
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Movies matching: <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">"{decodeURIComponent(term)}"</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Found <span className="text-purple-400 font-bold">{similarMovies.length}</span> perfect matches for you
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {similarMovies.map((movie, i) => (
            <div key={movie._id} className="relative">
              <div className="absolute -left-4 -top-4 flex items-center justify-center text-white font-black text-2xl z-40 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 w-12 h-12 shadow-lg border-2 border-white/20">
                {i + 1}
              </div>

              <MoviePoster movie={movie} />
            </div>
          ))}
        </div>

        {similarMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 dark:text-gray-400">No movies found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchTerm;
