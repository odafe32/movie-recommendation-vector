import MoviePoster from "@/components/MoviePoster";
import ImageWithFallback from "@/components/ImageWithFallback";
import db from "@/db";
import { Movie, SimilarMovie } from "@/types";
import { notFound } from "next/navigation";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

async function MoviePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const movies = db.collection("movies"); // Updated to correct collection name

  const search = await movies.find({ $and: [{ _id: id }] });

  if (!(await search.hasNext())) {
    return notFound();
  }

  const movie = (await search.next()) as Movie;

  let similarMovies: SimilarMovie[] = [];
  let hasVectorSearchError = false;

  try {
    const similarMoviesResult = (await movies
      .find(
        {},
        {
          vector: movie.$vector,
          limit: 6, // we will cut the first movie and want to show 5 similar movies
          includeSimilarity: true,
        }
      )
      .toArray()) as SimilarMovie[];

    // cut the first movie because it is the same as the movie we are looking for
    similarMoviesResult.shift();
    similarMovies = similarMoviesResult;
  } catch (error: any) {
    console.error("Vector search failed:", error);
    hasVectorSearchError = true;

    // Fallback: Get movies from the same genre
    try {
      const fallbackMovies = (await movies
        .find(
          {
            Genre: { $regex: movie.Genre.split(",")[0].trim(), $options: "i" },
            _id: { $ne: id },
          },
          {
            limit: 5,
          }
        )
        .toArray()) as SimilarMovie[];

      similarMovies = fallbackMovies;
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      // If even the fallback fails, we'll show an empty array
      similarMovies = [];
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Hero Section with Movie Details */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Movie Poster */}
            <div className="shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <ImageWithFallback
                  className="relative w-[320px] h-[480px] object-cover rounded-3xl shadow-2xl"
                  src={movie.Poster}
                  alt={movie.Title}
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="inline-block mb-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                      {movie.Genre}
                    </span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                  {movie.Title}
                </h1>
              </div>

              {/* Plot/Description */}
              {(movie.Plot || movie.$vectorize) && (
                <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Plot</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {movie.Plot || movie.$vectorize}
                  </p>
                </div>
              )}

              {/* Movie Details Grid */}
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Director</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Director}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Featuring</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Actors}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Box Office</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.BoxOffice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Released</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Released}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Runtime</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Runtime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Rated</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Rated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">IMDB Rating</p>
                      <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                        <span className="text-yellow-400">⭐</span>
                        {movie.imdbRating}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white dark:text-gray-500 uppercase tracking-wider mb-1">Language</p>
                      <p className="text-gray-900 dark:text-white font-semibold">{movie.Language}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Recommendations
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            {hasVectorSearchError
              ? "Movies from the same genre"
              : "Similar Films You May Like"}
          </h2>
        </div>

        {hasVectorSearchError && (
          <div className="mb-8">
            <div className="bg-yellow-900/20 border border-yellow-600/30 text-yellow-300 p-6 rounded-2xl backdrop-blur-sm">
              <p className="font-bold mb-2">⚠️ Note:</p>
              <p className="text-yellow-200/80">
                AI-powered recommendations are temporarily unavailable. Showing
                movies from the same genre instead.
              </p>
            </div>
          </div>
        )}

        {similarMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {similarMovies.map((movie, i) => (
              <MoviePoster
                key={movie._id}
                index={i + 1}
                similarityRating={
                  movie.$similarity && !hasVectorSearchError
                    ? Number(movie.$similarity.toFixed(2)) * 100
                    : 0
                }
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="py-20">
            <div className="bg-white/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 p-12 rounded-2xl text-center backdrop-blur-sm">
              <p className="text-2xl font-bold mb-2">No similar movies found</p>
              <p className="text-gray-400">
                Try browsing our movie collection or search for specific titles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoviePage;
